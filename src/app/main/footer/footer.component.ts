import {animate, style, transition, trigger} from '@angular/animations';
import {Component} from '@angular/core';

@Component({
  selector: 'bthles-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [
    trigger(
        'appearAfterThreeSeconds',
        [
          transition(
              ':enter',
              [
                style({opacity: '0', transform: 'translateY(20px)'}),
                animate('225ms 3s ease-out'),
              ]),
        ]),
  ],
})
export class FooterComponent {
}
