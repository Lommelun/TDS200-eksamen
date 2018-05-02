import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public auth: FireAuthProvider) {

  }

  logout() {
    this.auth.logout();
  }
}
