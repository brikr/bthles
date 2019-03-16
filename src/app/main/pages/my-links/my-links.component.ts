import {Component} from '@angular/core';
import {AngularFirestore, DocumentChangeAction} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {environment} from '@bthles-environment/environment';
import {Link} from '@bthles-types/types';
import {AuthService} from '@bthles/services/auth.service';
import {User} from 'firebase';
import {Observable, of} from 'rxjs';
import {filter, flatMap, map, partition} from 'rxjs/operators';

@Component({
  selector: 'bthles-my-links',
  templateUrl: './my-links.component.html',
  styleUrls: ['./my-links.component.scss']
})
export class MyLinksComponent {
  links$: Observable<LinkWithExtra[]>;
  deletedLinks$: Observable<LinkWithExtra[]>;
  baseUrl: string;
  isAnonymous = false;

  constructor(
      afs: AngularFirestore,
      private readonly fns: AngularFireFunctions,
      authService: AuthService,
  ) {
    const allLinks$ = authService.getUser().pipe(
        flatMap((user: User|null) => {
          if (user === null) {
            return of([]);
          }
          this.isAnonymous = user.isAnonymous;
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
              deleting: false,
              ...data,
            } as LinkWithExtra;
          });
        }),
    );

    this.links$ = allLinks$.pipe(map((links: LinkWithExtra[]) => {
      return links.filter((link: LinkWithExtra) => link.content !== undefined);
    }));
    this.deletedLinks$ = allLinks$.pipe(map((links: LinkWithExtra[]) => {
      return links.filter((link: LinkWithExtra) => link.content === undefined);
    }));

    this.baseUrl = environment.baseUrl;
  }

  deleteLink(link: LinkWithExtra) {
    link.deleting = true;
    const remoteDeleteLink =
        this.fns.httpsCallable<string, void>('callableDeleteLink');
    // Using async/await here makes it so Angular doesn't run change detection
    // until the whole function is done, and the spinner will never appear.
    remoteDeleteLink(link.short).subscribe(() => {
      link.deleting = false;
    });
  }
}

interface LinkWithExtra extends Link {
  short: string;
  deleting: boolean;
}
