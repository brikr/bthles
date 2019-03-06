import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
      private readonly afAuth: AngularFireAuth,
  ) {}

  login(type: 'GOOGLE'|'ANON' = 'ANON'): Promise<auth.UserCredential> {
    switch (type) {
      default:
      case 'ANON':
        return this.afAuth.auth.signInAnonymously();
      case 'GOOGLE':
        return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
  }

  getUid(): string {
    const user = this.afAuth.auth.currentUser;
    if (user === null) {
      return '';
    }
    return user.uid;
  }
}
