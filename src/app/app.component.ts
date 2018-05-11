import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';
import firestore from 'firebase/app';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    fireauth: FireAuthProvider) {
    /* 
    Keeps the user logged in and keeps track of the authentication state.
    If the user is logged in, the root page is set to the main app - otherwise
    the user is forced to the login page.
    */
    const authState$ = fireauth.authState.subscribe(user => {
      this.rootPage = user ? TabsPage : 'LoginPage';
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
