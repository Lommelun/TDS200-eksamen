import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import Moment from 'moment';
import * as env from '../../app/env';
import { Book } from '../../models/book';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {
  book: Book;
  valid: boolean = false;

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
    this.book = { title: '', writer: '', publisher: '', published_year: null, seller: '', img: '' };
    this.book.seller = firebase.auth().currentUser.uid;
  }

  fetchBookInfoByISBN(): void {
    /*
    Does not trigger if isbn is not at least standard isbn length (10 OR 13) 
    and removes non-numeric characters.
    */
    const sanitizedInput: string = this.searchQuery.replace(/[^0-9\.]+/g, '');
    if (sanitizedInput.length < 10) return;

    /*
    Looks up the queried isbn number from IsbnDB and updates the book object
    based on results. Api key is required in the header, and not as a GET
    parameter, so the API key is sent in the header.
    */
    this.http
      .get(`https://api.isbndb.com/book/${sanitizedInput}`, {
        headers: { 'X-API-KEY': env.isbndb.apiKey }
      })
      .subscribe(json => {
        const result = json['book'];
        this.book.title = result.title;
        this.book.writer = result.authors.join(", ");
        this.book.img = result.image;
        this.image = result.image;
        this.book.publisher = result.publisher;

        /*
        Moment, a third party library is used to read the varying date formats
        from the response and gets only the year, which is updated on the book
        object if successful.

        A custom format list is fed to the Moment constructor based on most 
        formats returned from IsbnDB.
        */
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
        this.valid = true;
      });
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
      targetHeight: 600,
      targetWidth: 600,
      sourceType: mode,
      quality: 80,
      correctOrientation: true
    }).then(base64 => {
      this.uploadToStorage = true;
      this.image = `data:image/png;base64,${base64}`;
    }).catch(error => console.error('Something went wrong getting the picture: ', error));
  }

  uploadImage(): Promise<string> {
    const filename: string = `books/${localStorage.getItem('user-email')}_${new Date().getTime()}.jpeg`;

    let ref = this.firestorage.ref(filename);
    let task = ref.putString(this.image, 'data_url');

    task.percentageChanges().subscribe(progress => this.uploadProgress = progress);
    return task.downloadURL().toPromise();
  }

  async submit(): Promise<void> {
    if (!this.book.seller) return;
    let loading = this.loadingCtl.create({
      content: 'Legger ut annonse...'
    });

    loading.present();
    if (this.uploadToStorage) await this.uploadImage().then(url => this.book.img = url);
    await this.bookRepo.add(this.book);
    this.navCtrl.pop();
    loading.setSpinner('hide');
    loading.setContent('Ferdig!');
    setTimeout(() => loading.dismiss(), 800);
  }

  validate(): void {
    if (this.book.title.length < 2) this.valid = false;
    if (this.book.writer.length < 2) this.valid = false;
    if (this.book.publisher.length < 2) this.valid = false;
    if (!this.book.published_year) {
      this.valid = false;
    } else {
      this.valid = true;
    }
  }

}
