import {Component} from '@angular/core';

import {AuthService} from './auth.service';

@Component({
  selector: 'bthles-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(private readonly authService: AuthService) {
    authService.login();
  }
}
