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

  ionViewDidLoad() {
    this.auth.logout();
  }

  login() {
    this.auth.authenticate(this.user.username, this.password);
  }

  logout() {
    this.auth.logout();
  }

  startRegistration(): void {
    this.registering = true;
  }

  register(): void {
    this.auth.register(this.user.username, this.password);
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
    const fileRef: string = `users/${localStorage.getItem('user-email')}_${new Date().getTime()}.jpeg`;
    return this.firestorage.uploadAsDataUrl(fileRef, this.image);
  }

  async submit() {
    let loading = this.loadingCtl.create({
      content: 'Oppretter bruker...'
    });

    loading.present();
    await this.uploadImage().then(url => this.user.image = url);
    await this.userDao.add(this.user);
    this.navCtrl.pop();
    loading.setSpinner('hide');
    loading.setContent('Velkommen!');
    setTimeout(timer => { loading.dismiss() }, 700);
  }
}
