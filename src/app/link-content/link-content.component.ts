import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {AngularFireFunctions} from '@angular/fire/functions';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {environment} from '@bthles-environment/environment';
import {Link} from '@bthles-types/types';

@Component({
  selector: 'bthles-link-content',
  templateUrl: './link-content.component.html',
  styleUrls: ['./link-content.component.scss']
})
export class LinkContentComponent {
  constructor(
      route: ActivatedRoute,
      db: AngularFirestore,
      fns: AngularFireFunctions,
  ) {
    route.paramMap.subscribe(async (params: ParamMap) => {
      // short param is definitely defined because we can only here from the
      // route with short defined
      const short = params.get('short') as string;
      const snapshot =
          (await db.collection('links').doc<Link>(short).ref.get());
      const dest = snapshot.data() as Link | undefined;

      if (dest !== undefined && dest.content !== undefined) {
        const incrementHitCount =
            fns.httpsCallable<string, void>('callableIncrementHitCount');
        await incrementHitCount(short).toPromise();
        window.location.replace(dest.content);
      } else {
        window.location.replace(environment.baseUrl);
      }
    });
  }
}
