import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {LinkContentComponent} from '@bthles/link-content/link-content.component';
import {ShortenerComponent} from '@bthles/shortener/shortener.component';
import {FooterComponent} from './footer/footer.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: ShortenerComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    component: FooterComponent,
    outlet: 'footer',
  },
  {
    // It's important that this route is last so that the routes before it take
    // precedence. This allows us to have certain paths go to predefined pages
    // instead of being treated as links.
    path: ':short',
    component: LinkContentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
