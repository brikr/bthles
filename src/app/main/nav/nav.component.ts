import {Component} from '@angular/core';
import {AuthService} from '@bthles/services/auth.service';
import {User} from 'firebase';
import {Observable} from 'rxjs';

@Component({
  selector: 'bthles-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  unanonymousUser$: Observable<User|null>;
  logoutPending = false;

  constructor(
      readonly authService: AuthService,
  ) {
    this.unanonymousUser$ = authService.getUnanonymousUser();
  }

  async login() {
    await this.authService.login('GOOGLE');
  }

  async logout() {
    // "Logging out" is just converting back to anonymous login.
    this.logoutPending = true;
    await this.authService.login('ANON');
    this.logoutPending = false;
  }
}
