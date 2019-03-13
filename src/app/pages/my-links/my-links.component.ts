import {Component} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {environment} from '@bthles-environment/environment';
import {Link} from '@bthles-types/types';
import {AuthService} from '@bthles/auth.service';
import {User} from 'firebase';
import {Observable, of} from 'rxjs';
import {flatMap, map} from 'rxjs/operators';

@Component({
  selector: 'bthles-my-links',
  templateUrl: './my-links.component.html',
  styleUrls: ['./my-links.component.scss']
})
export class MyLinksComponent {
  links$: Observable<LinkWithShort[]>;
  baseUrl: string;

  constructor(
      afs: AngularFirestore,
      authService: AuthService,
  ) {
    this.links$ = authService.getUser().pipe(
        flatMap((user: User|null) => {
          if (user === null) {
            return of([]);
          }
          return afs
              .collection<Link>(
                  'links', ref => ref.where('owner', '==', user.uid))
              .snapshotChanges();
        }),
        map((actions: Array<DocumentChangeAction<Link>>) => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Link;
            const id = a.payload.doc.id;
            return {
              short: id,
              ...data,
            };
          });
        }));

    this.baseUrl = environment.baseUrl;
  }
}

interface LinkWithShort extends Link {
  short: string;
}
