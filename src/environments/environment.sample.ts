// Copy this to a file named environment.ts and fill in the firebase fields with
// your project's initialization information. See
// https://firebase.google.com/docs/web/setup for instructions on getting your
// initialization information.

// If you want to deploy to your Firebase project, you can make another
// environment file named environment.staging.ts or environment.prod.ts with the
// baseUrl pointing to your firebaseapp.com domain (e.g. bthles.firebaseapp.com)

export const environment = {
  production: false,
  firebase: {
    apiKey: '<API_KEY>',
    authDomain: '<PROJECT_ID>.firebaseapp.com',
    databaseURL: 'https://<DATABASE_NAME>.firebaseio.com',
    projectId: '<PROJECT_ID>',
    storageBucket: '<BUCKET>.appspot.com',
    messagingSenderId: '<SENDER_ID>',
  },
  baseUrl: 'http://localhost:4200',
};
