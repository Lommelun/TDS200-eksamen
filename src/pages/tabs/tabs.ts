import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BookOverviewPage } from '../book-overview/book-overview';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {
  private tabHome: any;
  private tabOverview: any;
  private tabUser: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tabHome = 'HomePage';
    this.tabOverview = 'BookOverviewPage';
    this.tabUser = 'UserprofilePage';
  }

}
