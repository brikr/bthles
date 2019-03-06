import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {interval, Observable, ReplaySubject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

import {AuthService} from './auth.service';

interface Meta {
  nextUrl: string;
}

@Component({
  selector: 'bthles-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  meta$: Observable<Meta|undefined>;
  content = '';

  constructor(
      private readonly db: AngularFirestore,
      private readonly authService: AuthService) {
    authService.login();
    this.meta$ = db.doc<Meta>('meta/meta').valueChanges();
  }

  // TODO(brikr): this workflow should be moved to a service
  async shorten() {
    if (!this.content) {
      // nop on empty content
      return;
    }


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

        await this.db.collection('links').doc(meta.nextUrl).set({
          content: this.content,
          type: 'link',
          owner: this.authService.getUid(),
        });
        success.next();
      } catch {
        // nop, retry
      }
    });
  }
}
