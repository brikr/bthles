import {Component} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

@Component({
  selector: 'bthles-link-content',
  templateUrl: './link-content.component.html',
  styleUrls: ['./link-content.component.scss']
})
export class LinkContentComponent {
  linkId = '';

  constructor(
      private readonly route: ActivatedRoute,
  ) {
    this.route.paramMap.subscribe((params: ParamMap) => {
      // short param is definitely defined because we can only here from the
      // route with short defined
      this.linkId = params.get('short')!;
    });
  }
}
