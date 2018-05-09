import { Component } from '@angular/core';
import { NavController, IonicPage, NavParams } from 'ionic-angular';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public auth: FireAuthProvider) { }

  logout() {
    this.auth.logout();
  }

  addBook() {
    this.navCtrl.push('AddBookPage')
      .catch(error => console.error(error));
  }
}
