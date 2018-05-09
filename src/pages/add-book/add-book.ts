import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { AngularFireStorage } from 'angularfire2/storage';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Book } from '../../models/book';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage {
  book: Book = {} as Book;
  public uploadProgress: number;
  public image: string;
  private imageType: number;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public bookRepo: BookRepositoryProvider,
    public firestorage: AngularFireStorage,
    public camera: Camera) { }

  fetchBookInfoByISBN(event: Event) {
    console.log(event);
  }

  selectPicture(): void {
    this.camera.getPicture({
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true
    }).then(file => {
      this.image = file;
    }).catch(error => console.error(error));
  }

  takePicture(): void {
    this.camera.getPicture({
      destinationType: this.camera.DestinationType.DATA_URL,
      cameraDirection: this.camera.Direction.BACK,
      encodingType: this.camera.EncodingType.PNG,
      quality: 90,
      correctOrientation: true
    }).then(base64 => {
      this.image = base64;
    }).catch(error => console.error('something went wrong: ', error));
  }

  uploadImage(): void {
    let filename: string = `books/${localStorage.getItem('user-email')}_${new Date().getTime()}.png`;

    let task = this.firestorage.ref(filename)
      .putString(this.image, 'base64', { contentType: 'image/png' });

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
