import {Directive, HostListener, Input} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ClipboardService} from 'ngx-clipboard';

@Directive({selector: '[copyAndNotify]'})
export class CopyAndNotifyDirective {
  @Input() copyAndNotify = '';

  @HostListener('click')
  onClick() {
    const success = this.clipboardService.copyFromContent(this.copyAndNotify);
    if (success) {
      this.snackbar.open('Copied to clipboard', undefined, {duration: 1000});
    } else {
      this.snackbar.open('Copy failed', undefined, {duration: 1000});
    }
  }

  constructor(
      private readonly clipboardService: ClipboardService,
      private readonly snackbar: MatSnackBar,
  ) {}
}
