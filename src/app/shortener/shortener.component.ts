import {animate, style, transition, trigger} from '@angular/animations';
import {fn} from '@angular/compiler/src/output/output_ast';
import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {MatSnackBar} from '@angular/material';
import {environment} from '@bthles-environment/environment';
import {Meta} from '@bthles-types/types';
import {AuthService} from '@bthles/auth.service';
import {interval, ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
                    '225ms', style({opacity: '1', transform: 'translateY(0)'}))
              ]),
          transition(
              ':leave',
              [
                style({
                  opacity: '1',
                  transform: 'translateY(0)',
                  // Making elements absolute when leaving lets them overlap
                  // with the incoming elements
                  position: 'absolute'
                }),
                animate(
                    '195ms',
                    style({opacity: '0', transform: 'translateY(20px)'}))
              ]),
        ]),
  ]
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
      private readonly snackBar: MatSnackBar,
  ) {}

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

    this.state = ShortenerState.AWAITING_RESPONSE;

    // Attempt to create link at nextUrl. If it fails due to lack of
    // permissions, that means it already exists and the Firestore function is
    // currently updating the field, so we try again every second until we make
    // the link. This only occurs when multiple people create links in quick
    // succession, and the Firestore function is only slow if nobody is creating
    // links, so it's rare we have to retry here.
    const success = new ReplaySubject<never>();
    interval(1000).pipe(takeUntil(success)).subscribe(async () => {
      try {
        // Query db meta (notably nextUrl)
        const meta =
            (await this.db.doc<Meta>('meta/meta').ref.get()).data() as Meta;

        // Create short link document
        await this.db.collection('links').doc(meta.nextUrl).set({
          content: this.content,
          type: 'link',
          owner: this.authService.getUid(),
        });
        success.next();
        this.state = ShortenerState.LINK_RECEIVED;
        this.shortUrl = `${environment.baseUrl}/${meta.nextUrl}`;
      } catch {
        // We get an error if we didn't have permissions to create the record,
        // likely meaning it already exists. In this case, we request that the
        // server increment the nextUrl (it is likely already doing this due to
        // an onCreate hook, but in case it's slow or anything, we run it here
        // too. It's idempotent). Request server to increment
        const incrementNextUrl =
            this.fns.httpsCallable('callableIncrementNextUrl');
        await incrementNextUrl({}).toPromise();
      }
    });
  }

  copyInputContents(el: HTMLInputElement) {
    el.select();
    document.execCommand('copy');

    this.snackBar.open('Copied to clipboard', undefined, {duration: 1000});
  }
}

enum ShortenerState {
  START,
  AWAITING_RESPONSE,
  LINK_RECEIVED,
}
