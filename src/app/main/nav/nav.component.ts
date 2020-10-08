import {Component} from '@angular/core';
import {AngularFireFunctions} from '@angular/fire/functions';
import {LinkClaimData} from '@bthles-types/types';
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
      private readonly fns: AngularFireFunctions,
  ) {
    this.unanonymousUser$ = authService.getUnanonymousUser();
  }

  async login() {
    const fromUser = await this.authService.getUid();
    await this.authService.login('GOOGLE');
    const data = {
      fromUser,
      toUser: await this.authService.getUid(),
    };
    const remoteClaimLinks =
        this.fns.httpsCallable<LinkClaimData, void>('callableClaimLinks');
    await remoteClaimLinks(data).toPromise();
  }

  async logout() {
    // "Logging out" is just converting back to anonymous login.
    this.logoutPending = true;
    await this.authService.login('ANON');
    this.logoutPending = false;
  }
}
