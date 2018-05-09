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
      localStorage.setItem('user-email', user.email);
      localStorage.setItem('user-uid', user.uid);
    });
  }

  public register(email: string, password: string) {
    if (this.validateEmail(email)) {
      console.warn('Please enter a valid email.');
      return;
    }

    this.fireauth.auth.createUserWithEmailAndPassword(email, password)
      .then((response) => console.log('Registered', response))
      .catch((error) => console.error('Failed registering new user:', error));
  }

  public requestPassword(username: string) {
    this.fireauth.auth.sendPasswordResetEmail(username)
      .catch(error => console.error(error));
  }

  public authenticate(email: string, password: string) {
    if (this.validateEmail(email)) {
      console.warn('Please enter a valid email.');
      return;
    }

    this.fireauth.auth.signInWithEmailAndPassword(email, password)
      .then((response) => console.info('Logged you in', response))
      .catch((error) => console.error('', error));
  }

  public logout() {
    this.fireauth.auth.signOut()
      .then((success) => console.info('Logged out!', success))
      .catch((error) => console.error('Failed logging out: ', error));
  }

  // Checks that the input email is in the format of an email
  private validateEmail(email: string) {
    return (String.prototype.match("[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}"));
  }

}
