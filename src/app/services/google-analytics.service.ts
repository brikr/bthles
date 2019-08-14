import {Injectable} from '@angular/core';

// Google Analytics function defined in <script> tag in index.html
declare let ga: Function;

@Injectable({providedIn: 'root'})
export class GoogleAnalyticsService {
  constructor() {}

  // Sends an event to Google Analytics
  sendEvent(event: GoogleAnalyticsEvent) {
    if (event.eventLabel === undefined) {
      event.eventLabel = null;
    }
    if (event.eventValue === undefined) {
      event.eventValue = null;
    }
    ga('send', 'event', event);
  }

  // Sends an exception to Google Analytics
  sendException(exception: GoogleAnalyticsException) {
    if (exception.exDescription === undefined) {
      exception.exDescription = null;
    }
    if (exception.exFatal === undefined) {
      exception.exFatal = null;
    }
    ga('send', 'exception', exception);
  }
}

export interface GoogleAnalyticsEvent {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string|null;
  eventValue?: number|null;
}

export interface GoogleAnalyticsException {
  exDescription?: string|null;
  exFatal?: boolean|null;
}
