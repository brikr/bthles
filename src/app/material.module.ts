import {NgModule} from '@angular/core';
import {MatButtonModule, MatInputModule, MatProgressBarModule, MatSnackBarModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatSnackBarModule,
  ],
})
export class MaterialModule {
}
