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
}

export interface GoogleAnalyticsEvent {
  eventCategory: string;
  eventAction: string;
  eventLabel?: string|null;
  eventValue?: number|null;
}
