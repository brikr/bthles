import {ErrorHandler, Inject, Injector} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {GoogleAnalyticsService} from '@bthles/services/google-analytics.service';

export class GlobalErrorHandler implements ErrorHandler {
  private readonly analytics: GoogleAnalyticsService;
  private readonly snackBar: MatSnackBar;

  constructor(@Inject(Injector) injector: Injector) {
    this.analytics = injector.get(GoogleAnalyticsService);
    this.snackBar = injector.get(MatSnackBar);
  }

  handleError(error: Exception) {
    // Log the first line of the rejection message to GA
    this.analytics.sendException({
      exDescription: error.rejection.toString().split('\n')[0],
      exFatal: true,
    });

    // Show snackbar requesting refresh
    this.snackBar.open('An error has occured. Try reloading the page.');

    // Re-throw the original error
    throw error;
  }
}

interface Exception {
  rejection: {toString(): string;};
}
