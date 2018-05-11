import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import firebase from 'firebase/app';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { FireStorageProvider } from '../../providers/fire-storage/fire-storage';
import { UserDaoProvider } from '../../providers/firestore/user-dao';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  public user: User;
  password: string;

  registering: boolean = false;
  image: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtl: LoadingController,
    private firestorage: FireStorageProvider,
    private userDao: UserDaoProvider,
    private auth: FireAuthProvider,
    private camera: Camera
  ) {
    this.user = { username: '', name: '', age: null, address: { street: '', city: '' }, image: '' } as User;
  }

  login() {
    /*
    If successful also authenticates the user in this core firebase object,
    which in turn changes the root page to HomePage in app.component.ts.
    */
    this.auth.authenticate(this.user.username, this.password).catch(rejected => {
      this.loadingCtl.create({
        content: 'Feil bruker eller passord',
        duration: 600
      });
    });
  }

  logout() {
    this.auth.logout();
  }

  startRegistration(): void {
    this.registering = true;
  }

  async register() {
    // Fail fast approach: fail if no username & password is set
    if ((this.user.username == null) && this.password == null) return;

    let loading = this.loadingCtl.create({
      content: 'Oppretter bruker...'
    });

    loading.present();

    try {
      /* 
      Try to register - if already registered it throws an error.
      If successful also authenticates the user in this core firebase object,
      which in turn changes the root page to HomePage in app.component.ts
      */
      await this.auth.register(this.user.username, this.password);

      // Upload image if user has attached one
      if (this.image) await this.uploadImage().then(url => this.user.image = url);

      /*
      As uid has been generated for the user, get it from firebase core
      and upload the registered user as the new document for this user.
      Uid for the document corresponds to the authenticated users uid.
      */
      let uid = firebase.auth().currentUser.uid;
      await this.userDao.add(this.user, uid).catch(err => console.log(err));

      loading.setSpinner('hide');
      loading.setContent('Velkommen!');
      setTimeout(timer => { loading.dismiss() }, 600);
    } catch (error) {
      try {
        /*
        If registering failed - possible that user is already registered try 
        to authenticate again.
        */
        this.auth.authenticate(this.user.username, this.password);
        loading.setContent('Du har allerede en bruker, logger deg inn..');
        setTimeout(timer => { loading.dismiss() }, 800);
      } catch (error) {
        // Registering failed - show info to user 
        loading.setContent('Kunne ikke opprette bruker, sjekk feltene.');
        setTimeout(timer => { loading.dismiss() }, 1500);
      }
    }
  }


  requestPass(): void {
    this.auth.requestPassword(this.user.username);
  }

  /*
  Select a picture from camera or local storage. Mode determines where and
  is passed from the button clicked. Quality and direction are ignored
  when fetching from the local storage.
  */
  selectPicture(mode: number): void {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      cameraDirection: this.camera.Direction.BACK,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      targetHeight: 800,
      targetWidth: 800,
      sourceType: mode,
      quality: 80
    }).then(b64 => {
      this.image = `data:image/jpeg;base64,${b64}`;
    });
  }

  uploadImage(): Promise<string> {
    const fileRef: string = `users/${this.user.username}_${new Date().getTime()}.jpeg`;
    return this.firestorage.uploadAsDataUrl(fileRef, this.image);
  }

}
