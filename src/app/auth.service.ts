import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
      private readonly afAuth: AngularFireAuth,
  ) {}

  login(type: 'GOOGLE'|'ANON'): Promise<auth.UserCredential> {
    switch (type) {
      default:
      case 'ANON':
        return this.afAuth.auth.signInAnonymously();
      case 'GOOGLE':
        return this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
    }
  }
}
