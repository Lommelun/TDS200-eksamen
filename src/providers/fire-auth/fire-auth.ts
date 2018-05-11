import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase';

@Injectable()
export class FireAuthProvider {
  authState: Observable<User>;

  constructor(public fireauth: AngularFireAuth) {
    this.authState = fireauth.authState;
    this.authState.subscribe(user => {
      // Stores a local cache on the phone for easy access of the current user email and id
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-uid', user.uid);
    });
  }

  public register(email: string, password: string): Promise<any> {
    if (this.validateEmail(email)) {
      console.warn('Please enter a valid email.');
      return;
    }

    return this.fireauth.auth.createUserWithEmailAndPassword(email, password);
  }

  public requestPassword(username: string): Promise<any> {
    return this.fireauth.auth.sendPasswordResetEmail(username);
  }

  public authenticate(email: string, password: string): Promise<any> {
    if (this.validateEmail(email)) {
      console.warn('Please enter a valid email.');
      return;
    }
    return this.fireauth.auth.signInWithEmailAndPassword(email, password);
  }

  public logout(): Promise<any> {
    return this.fireauth.auth.signOut();
  }

  // Checks that the input email is in the format of an email
  private validateEmail(email: string) {
    return (String.prototype.match("[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}"));
  }

}
