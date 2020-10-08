import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth, User} from 'firebase/app';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class AuthService {
  constructor(
      private readonly afAuth: AngularFireAuth,
  ) {}

  login(type: 'GOOGLE'|'ANON' = 'ANON'): Promise<auth.UserCredential> {
    switch (type) {
      default:
      case 'ANON':
        return this.afAuth.signInAnonymously();
      case 'GOOGLE':
        return this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
    }
  }

  async getUid(): Promise<string> {
    const user = await this.afAuth.currentUser;
    if (user === null) {
      return '';
    }
    return user.uid;
  }

  getUser(): Observable<User|null> {
    return this.afAuth.user;
  }

  getUnanonymousUser(): Observable<User|null> {
    return this.afAuth.user.pipe(map((user: firebase.User|null) => {
      if (user !== null && user.isAnonymous) {
        return null;
      }
      return user;
    }));
  }
}
