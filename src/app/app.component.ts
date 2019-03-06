import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

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

  constructor(private readonly db: AngularFirestore, authService: AuthService) {
    authService.login('ANON');
    this.meta$ = db.doc<Meta>('meta/meta').valueChanges();
  }

  async shorten() {
    if (!this.content) {
      return;
    }
    const meta =
        (await this.db.doc<Meta>('meta/meta').ref.get()).data() as Meta;
    console.log(meta.nextUrl);
  }
}
