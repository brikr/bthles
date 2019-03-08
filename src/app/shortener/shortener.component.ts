import {animate, style, transition, trigger} from '@angular/animations';
import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
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

  // give template access to enum
  ShortenerState = ShortenerState;

  constructor(
      private readonly db: AngularFirestore,
      private readonly authService: AuthService,
  ) {}

  // TODO(brikr): this workflow should be moved to a service
  async shorten() {
    if (!this.content) {
      // nop on empty content
      return;
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
        this.shortUrl = meta.nextUrl;
      } catch {
        // nop, retry
      }
    });
  }
}

enum ShortenerState {
  START,
  AWAITING_RESPONSE,
  LINK_RECEIVED,
}
