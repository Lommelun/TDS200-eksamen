import { BrowserModule } from '@angular/platform-browser';
import {} from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import env from '../env';
import { FireAuthProvider } from '../providers/fire-auth/fire-auth';
import { FireDbProvider } from '../providers/fire-db/fire-db';
import { FireStoreProvider } from '../providers/fire-store/fire-store';
import { HttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(env),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FireAuthProvider,
    FireDbProvider,
    FireStoreProvider,
    HttpClient
  ]
})
export class AppModule {}
