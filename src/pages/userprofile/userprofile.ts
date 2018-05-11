import { Component } from '@angular/core';
import firebase from 'firebase/app';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Book } from '../../models/book';
import { User } from '../../models/user';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import { UserDaoProvider } from '../../providers/firestore/user-dao';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html',
})
export class UserprofilePage {
  books: Observable<Book[]>;
  user: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userDao: UserDaoProvider,
    private bookRepo: BookRepositoryProvider
  ) {
    this.getUserData();
    this.books = this.getUserUploadedBooks();
  }

  async getUserData(): Promise<void> {
    await this.userDao.getUserById(firebase.auth().currentUser.uid)
      .then(user => this.user = (user.exists) ? user.data() : null);
    this.getUserUploadedBooks();
  }

  getUserUploadedBooks(): Observable<Book[]> {
    return this.bookRepo.getCollectionWithIds()
      .map(arr => arr.filter(book => book.seller == firebase.auth().currentUser.uid));
  }

}
