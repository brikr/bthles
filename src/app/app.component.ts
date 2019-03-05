import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';

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

  constructor(db: AngularFirestore) {
    this.meta$ = db.doc<Meta>('meta/meta').valueChanges();
  }
}
