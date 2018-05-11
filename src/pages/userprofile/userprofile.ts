import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { UserDaoProvider } from '../../providers/firestore/user-dao';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import { Book } from '../../models/book';
import firebase from 'firebase/app';

@IonicPage()
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html',
})
export class UserprofilePage {
  books: Book[];
  user: User = { address: {} } as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userDao: UserDaoProvider,
    private auth: FireAuthProvider,
    private bookRepo: BookRepositoryProvider
  ) { this.getUserData(); }

  async getUserData() {
    console.log(firebase.auth().currentUser.uid)
    await this.userDao.getUserById(firebase.auth().currentUser.uid)
      .then(user => this.user = (user.exists) ? user.data() : null);
      console.log(this.user);
    this.getUserUploadedBooks();
  }

  getUserUploadedBooks() {
    let books: Book[];
    this.bookRepo.getCollectionWithIds().toPromise().then(arr => books = arr);
    this.books = books.filter(book => book.seller == this.user.uid);
  }
}
