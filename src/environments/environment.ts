// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyB_S6VtoIaSryUXknqPz3DXGPyHUtMkH5U',
    authDomain: 'bthles-dev.firebaseapp.com',
    databaseURL: 'https://bthles-dev.firebaseio.com',
    projectId: 'bthles-dev',
    storageBucket: 'bthles-dev.appspot.com',
    messagingSenderId: '4574988607'
  },
  baseUrl: 'localhost:4200',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`,
 * `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a
 * negative impact on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
