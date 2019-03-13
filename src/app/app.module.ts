import {NgModule} from '@angular/core';
import {AngularFireModule} from '@angular/fire';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireFunctionsModule} from '@angular/fire/functions';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from '@bthles/app-routing.module';
import {AppComponent} from '@bthles/app.component';
import {LinkContentComponent} from '@bthles/link-content/link-content.component';
import {MaterialModule} from '@bthles/material.module';
import {ShortenerComponent} from '@bthles/shortener/shortener.component';
import {ClipboardModule} from 'ngx-clipboard';

import {environment} from '../environments/environment';

import {UrlValidatorDirective} from './directives/url-validator.directive';
import {FooterComponent} from './footer/footer.component';
import {NavComponent} from './nav/nav.component';
import { MyLinksComponent } from './pages/my-links/my-links.component';
import { DefaultLayoutComponent } from './default-layout/default-layout.component';

@NgModule({
  declarations: [
    AppComponent,
    ShortenerComponent,
    LinkContentComponent,
    UrlValidatorDirective,
    FooterComponent,
    NavComponent,
    MyLinksComponent,
    DefaultLayoutComponent,
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireFunctionsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    ClipboardModule,
    FlexLayoutModule,
    FormsModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
}
