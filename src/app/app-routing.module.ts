import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LinkContentComponent} from '@bthles/link-content/link-content.component';
import {MainComponent} from '@bthles/main/main.component';
import {MyLinksComponent} from '@bthles/main/pages/my-links/my-links.component';
import {ShortenerComponent} from '@bthles/main/shortener/shortener.component';

const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: ShortenerComponent,
      },
      {
        path: 'pages',
        children: [
          {
            path: 'my-links',
            component: MyLinksComponent,
          },
        ],
      }
    ],
  },
  {
    // It's important that this route is last so that the routes before it take
    // precedence. This allows us to have certain paths go to predefined pages
    // instead of being treated as links.
    path: ':short',
    component: LinkContentComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
