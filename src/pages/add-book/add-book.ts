import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import Moment from 'moment';
import { Book } from '../../models/book';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {
  book: Book = {} as Book;

  public searchQuery: string;

  public loadingImagePreview: boolean;
  public image: string;

  public submittingAd: boolean;
  public uploadToStorage: boolean = false;
  public uploadProgress: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtl: LoadingController,
    public firestorage: AngularFireStorage,
    private auth: FireAuthProvider,
    public bookRepo: BookRepositoryProvider,
    public http: HttpClient,
    public camera: Camera
  ) { 
    this.auth.authState.subscribe(user => this.book.seller = user.uid);
  }

  fetchBookInfoByISBN(): void {
    if (this.searchQuery.length < 10) return;
    const sanitizedInput: string = this.searchQuery.replace(/[^0-9\.]+/g, '');
    this.http
      .get(`https://api.isbndb.com/book/${sanitizedInput}`, {
        headers: { 'X-API-KEY': 'e1W40ny8id4J5LNw4RRXC1q1DUwWiqLP5wbA3ts1' }
      })
      .subscribe(json => {
        const result = json['book'];
        this.book.title = result.title;
        this.book.writer = result.authors.join(", ");
        this.book.img = result.image;
        this.image = result.image;
        this.book.publisher = result.publisher;

        const date = result.date_published;
        const format: Moment.MomentBuiltinFormat[] = [
          Moment.defaultFormat,
          Moment.ISO_8601,
          Moment.RFC_2822,
          'MMMM,Y',
          'Y,MMMM',
          'DDMMY',
          'MDY',
          'MMDDY',
          'DMY',
          'Y'] as Moment.MomentBuiltinFormat[];

        if (Moment(date, format).isValid()) {
          this.book.published_year = Moment(date, format).year();
        } else {
          this.book.published_year = null;
        }
      });
  }

  selectPicture(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 600,
      targetWidth: 600,
      correctOrientation: true
    }).then(base64 => {
      this.uploadToStorage = true;
      this.image = `data:image/png;base64,${base64}`;
    }).catch(error => console.error(error));
  }

  takePicture(): void {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      cameraDirection: this.camera.Direction.BACK,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 600,
      targetWidth: 600,
      quality: 80,
      correctOrientation: true
    }).then(base64 => {
      this.uploadToStorage = true;
      this.image = `data:image/png;base64,${base64}`;
    }).catch(error => console.error('something went wrong: ', error));
  }

  uploadImage(): Promise<string> {
    const filename: string = `books/${localStorage.getItem('user-email')}_${new Date().getTime()}.jpeg`;

    let ref = this.firestorage.ref(filename);
    let task = ref.putString(this.image, 'data_url');

    task.percentageChanges().subscribe(progress => this.uploadProgress = progress);
    return task.downloadURL().toPromise();
  }

  async submit() {
    if(this.book.seller) return;
    let loading = this.loadingCtl.create({
      content: 'Legger ut annonse...'
    });

    loading.present();
    if (this.uploadToStorage) await this.uploadImage().then(url => this.book.img = url);
    await this.bookRepo.add(this.book);
    this.navCtrl.pop();
    loading.setSpinner('hide');
    loading.setContent('Ferdig!');
    loading.setDuration(700);
  }

  validate(): boolean {
    return true;
  }

}
