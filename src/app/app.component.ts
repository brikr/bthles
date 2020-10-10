import {Component} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '@bthles-environment/environment';
import {AuthService} from '@bthles/services/auth.service';
import {User} from 'firebase';
import {take} from 'rxjs/operators';

// Google Analytics function defined in <script> tag in index.html
declare let ga: Function;

@Component({
  selector: 'bthles-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
      authService: AuthService,
      fns: AngularFireFunctions,
      router: Router,
  ) {
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        ga('set', 'page', event.urlAfterRedirects);
        ga('send', 'pageview');
      }
    });

    authService.getUser().pipe(take(1)).subscribe((user: User|null) => {
      // Login anonymously if we aren't already logged in
      if (user === null) {
        authService.login();
      }
    });

    // Use functions emulator if environment calls for it
    if (environment.useEmulator) {
      fns.useFunctionsEmulator('http://localhost:5001');
    }
  }
}
