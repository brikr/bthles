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
import {UrlValidatorDirective} from '@bthles/directives/url-validator.directive';
import {LinkContentComponent} from '@bthles/link-content/link-content.component';
import {FooterComponent} from '@bthles/main/footer/footer.component';
import {MainComponent} from '@bthles/main/main.component';
import {NavComponent} from '@bthles/main/nav/nav.component';
import {MyLinksComponent} from '@bthles/main/pages/my-links/my-links.component';
import {ShortenerComponent} from '@bthles/main/shortener/shortener.component';
import {MaterialModule} from '@bthles/material.module';
import {ClipboardModule} from 'ngx-clipboard';

import {environment} from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    ShortenerComponent,
    LinkContentComponent,
    UrlValidatorDirective,
    FooterComponent,
    NavComponent,
    MyLinksComponent,
    MainComponent,
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
