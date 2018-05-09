import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Book } from '../../models/book';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Rx from 'rxjs/Rx';
import Moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {
  book: Book = {} as Book;
  public uploadProgress: number;
  public searchQuery: string;
  public image: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpClient,
    public bookRepo: BookRepositoryProvider,
    public firestorage: AngularFireStorage,
    public camera: Camera) { }

  fetchBookInfoByISBN() {
    this.http
      .get(`https://api.isbndb.com/book/${this.searchQuery}`, {
        headers: { 'X-API-KEY': 'e1W40ny8id4J5LNw4RRXC1q1DUwWiqLP5wbA3ts1' }
      })
      .subscribe(json => {
        let result = json['book'];
        this.book.title = result.title;
        this.book.writer = result.authors.join(", ");
        this.book.img = result.image;
        this.image = result.image;
        this.book.publisher = result.publisher;
        this.book.published_year = Moment(result.date_published, 'MMMM,Y').year();
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
    }).then(file => {
      this.image = file;
    }).catch(error => console.error(error));
  }

  takePicture(): void {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      cameraDirection: this.camera.Direction.BACK,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 600,
      targetWidth: 600,
      quality: 70,
      correctOrientation: true
    }).then(base64 => {
      this.image = base64;
    }).catch(error => console.error('something went wrong: ', error));
  }

  uploadImage(): void {
    const filename: string = `books/${localStorage.getItem('user-email')}_${new Date().getTime()}.jpeg`;

    let task = this.firestorage.ref(filename)
      .putString(this.image, 'base64', { contentType: 'image/jpeg' });

    task.percentageChanges().subscribe(progress => this.uploadProgress = progress);
    task.downloadURL().subscribe(downloadUrl => this.book.img = downloadUrl);
  }

  submit() {
    this.bookRepo.add(this.book);
  }

  validate(): boolean {
    return true;
  }
}
