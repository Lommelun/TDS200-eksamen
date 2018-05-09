import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { TabsPage } from '../pages/tabs/tabs';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  constructor(platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    fireauth: FireAuthProvider) {
    const authState$ = fireauth.authState.subscribe(user => {
       this.rootPage = user ? TabsPage : 'LoginPage';
    });

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
