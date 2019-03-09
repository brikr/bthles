// Staging environment uses the same database as dev, but the baseUrl is the
// deployed Firebase app
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
  baseUrl: 'https://bthles-dev.firebaseapp.com',
};
