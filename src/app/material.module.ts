import {NgModule} from '@angular/core';
import {MatButtonModule, MatInputModule, MatProgressBarModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
  ],
})
export class MaterialModule {
}
