import {NgModule} from '@angular/core';
import {MatButtonModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSnackBarModule} from '@angular/material';

@NgModule({
  imports: [
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  exports: [
    MatButtonModule,
    MatInputModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
})
export class MaterialModule {
}
