import {animate, style, transition, trigger} from '@angular/animations';
import {Component, OnDestroy} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Event, NavigationStart, Router} from '@angular/router';
import {environment} from '@bthles-environment/environment';
import {Meta} from '@bthles-types/types';
import {AuthService} from '@bthles/services/auth.service';
import {GoogleAnalyticsService} from '@bthles/services/google-analytics.service';
import {User} from 'firebase';
import {FirebaseError} from 'firebase';
import {interval, ReplaySubject} from 'rxjs';
import {first, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'bthles-shortener',
  templateUrl: './shortener.component.html',
  styleUrls: ['./shortener.component.scss'],
  animations: [
    trigger(
        'appearDisappear',
        [
          transition(
              ':enter',
              [
                style({opacity: '0', transform: 'translateY(-20px)'}),
                animate(
                    '225ms ease-out',
                    style({opacity: '1', transform: 'translateY(0)'}))
              ]),
          transition(
              ':leave',
              [
                style({
                  opacity: '1',
                  transform: 'translateY(0)',
                  // Making elements fixed when leaving lets them overlap
                  // with the incoming elements
                  position: 'fixed'
                }),
                animate(
                    '195ms ease-in',
                    style({opacity: '0', transform: 'translateY(20px)'}))
              ]),
        ]),
  ],
})
export class ShortenerComponent {
  content = '';
  state = ShortenerState.START;
  shortUrl = '';

  // give template access to some items
  ShortenerState = ShortenerState;

  constructor(
      private readonly db: AngularFirestore,
      private readonly fns: AngularFireFunctions,
      private readonly authService: AuthService,
      private readonly analytics: GoogleAnalyticsService,
      private readonly snackbar: MatSnackBar,
      router: Router,
  ) {
    router.events.subscribe((e: Event) => {
      if (e instanceof NavigationStart && e.url === '/') {
        this.init();
      }
    });
  }

  init() {
    this.content = '';
    this.state = ShortenerState.START;
    this.shortUrl = '';
  }

  // TODO(brikr): this workflow should be moved to a service
  async shorten() {
    if (!this.content) {
      // nop on empty content
      return;
    }

    // Add http protocol if none is provided
    if (!this.content.includes('://')) {
      this.content = `http://${this.content}`;
    }

    this.analytics.sendEvent(
        {eventCategory: 'ShortenerComponent', eventAction: 'shorten'});

    this.state = ShortenerState.AWAITING_RESPONSE;

    // Attempt to create link at nextUrl. If it fails due to lack of
    // permissions, that means it already exists and the Firestore function is
    // currently updating the field, so we try again every second until we make
    // the link. This only occurs when multiple people create links in quick
    // succession, and the Firestore function is only slow if nobody is creating
    // links, so it's rare we have to retry here.
    let success = false;
    do {
      try {
        // Query db meta (notably nextUrl)
        let meta =
            (await this.db.doc<Meta>('meta/meta').ref.get()).data() as Meta |
            undefined;

        // If meta is undefined (fresh database), use '0' for nextUrl
        // TODO: once we ditch clang-format, we can use ||= here
        if (meta === undefined) {
          meta = {nextUrl: '0'};
        }

        // Create short link document
        await this.db.collection('links').doc(meta?.nextUrl || '0').set({
          content: this.content,
          type: 'link',
          owner: await this.authService.getUid(),
        });
        success = true;

        this.state = ShortenerState.LINK_RECEIVED;
        this.shortUrl = `${environment.baseUrl}/${meta.nextUrl}`;

        // Show login tip if user isn't logged in
        this.authService.getUnanonymousUser().pipe(first()).subscribe(
            (u: User|null) => {
              if (u === null) {
                this.snackbar.open(
                    'Tip: You can sign in to take ownership of the links you create, which allows you to view their hit count and delete them.',
                    'OK');
              }
            });
        success = true;
      } catch (e) {
        if (e?.code === 'permission-denied') {
          success = false;
          // We get an error if we didn't have permissions to create the record,
          // likely meaning it already exists. In this case, we request that the
          // server increment the nextUrl (it is likely already doing this due
          // to an onCreate hook, but in case it's slow or anything, we run it
          // here too. It's idempotent). Request server to increment
          const incrementNextUrl =
              this.fns.httpsCallable<void, void>('callableIncrementNextUrl');
          await incrementNextUrl().toPromise();
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    } while (!success);
  }
}

enum ShortenerState {
  START,
  AWAITING_RESPONSE,
  LINK_RECEIVED,
}
