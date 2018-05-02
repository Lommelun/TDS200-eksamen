import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  username: string;
  password: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: FireAuthProvider) {}

  ionViewDidLoad() {}

  login() {
    this.auth.authenticate(this.username, this.password);
  }

  logout() {
    this.auth.logout();
  }

  register() {
    this.auth.register(this.username, this.password);
  }

  requestPass() {
    this.auth.requestPassword(this.username);
  }
  
}
