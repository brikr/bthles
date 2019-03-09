import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {environment} from '@bthles-environment/environment';
import {Link} from '@bthles-types/types';

@Component({
  selector: 'bthles-link-content',
  templateUrl: './link-content.component.html',
  styleUrls: ['./link-content.component.scss']
})
export class LinkContentComponent {
  linkId = '';

  constructor(
      private readonly route: ActivatedRoute,
      private readonly db: AngularFirestore,
  ) {
    this.route.paramMap.subscribe(async (params: ParamMap) => {
      // short param is definitely defined because we can only here from the
      // route with short defined
      this.linkId = params.get('short')!;
      const snapshot = (await this.db.collection('links')
                            .doc<Link>(params.get('short')!)
                            .ref.get());
      const dest = snapshot.data() as Link | undefined;

      if (dest !== undefined) {
        window.location.replace(dest.content);
      } else {
        window.location.replace(environment.baseUrl);
      }
    });
  }
}
