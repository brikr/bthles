import {ErrorHandler, Inject, InjectionToken} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {environment} from '@bthles-environment/environment';
import * as Rollbar from 'rollbar';

interface Exception {
  originalError?: string;
}

const rollbarConfig = {
  accessToken: 'dc562dc5cd1846998adf789d573491f3',
  captureUncaught: false,
  captureUnhandledRejections: true,
  environment: environment.baseUrl,
};

// tslint:disable-next-line:variable-name
export const RollbarService = new InjectionToken<Rollbar>('rollbar');

export function rollbarFactory(): Rollbar {
  return new Rollbar(rollbarConfig);
}

export class GlobalErrorHandler implements ErrorHandler {
  constructor(
      @Inject(RollbarService) private readonly rollbar: Rollbar,
      @Inject(MatSnackBar) private readonly snackBar: MatSnackBar,
  ) {}

  handleError(error: Exception) {
    // Log the error to Rollbar
    this.rollbar.error(error.originalError || error);

    // Show snackbar requesting refresh
    this.snackBar.open('An error has occured. Try reloading the page.');

    // Re-throw the original error
    throw error;
  }
}
