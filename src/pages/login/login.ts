import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
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
  public user: User = { username: '', address: {} } as User;
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
  ) { }

  login() {
    this.auth.authenticate(this.user.username, this.password).catch(rejected => {
      let loading = this.loadingCtl.create({
        content: 'Feil bruker eller passord',
        duration: 300
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
    if ((this.user.username == null) && this.password == null) return;

    let loading = this.loadingCtl.create({
      content: 'Oppretter bruker...'
    });

    loading.present();

    try {
      await this.auth.register(this.user.username, this.password);
      if (this.image) await this.uploadImage().then(url => this.user.image = url);
      await this.userDao.add(this.user);
      await this.auth.authenticate(this.user.username, this.password);
      loading.setSpinner('hide');
      loading.setContent('Velkommen!');
      setTimeout(timer => { loading.dismiss() }, 600);
    } catch (error) {
      console.log(error);
      try {
        this.auth.authenticate(this.user.username, this.password);
        loading.setContent('Du har allerede en bruker, logger deg inn..');
        setTimeout(timer => { loading.dismiss() }, 600);
      } catch (error) {
        console.log(error);
        loading.setContent('Kunne ikke opprette bruker, sjekk feltene.');
        setTimeout(timer => { loading.dismiss() }, 800);
      }
    }
  }


  requestPass(): void {
    this.auth.requestPassword(this.user.username);
  }

  selectPicture(mode: number): void {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
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
