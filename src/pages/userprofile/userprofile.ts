import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from '../../models/user';
import { UserDaoProvider } from '../../providers/firestore/user-dao';
import { FireAuthProvider } from '../../providers/fire-auth/fire-auth';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import { Book } from '../../models/book';

@IonicPage()
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html',
})
export class UserprofilePage {
  books: Book[];
  user: User = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public userDao: UserDaoProvider,
    private auth: FireAuthProvider,
    private bookRepo: BookRepositoryProvider
  ) {
    this.getUserData().then(success => this.getUserUploadedBooks());
  }

  getUserData(): Promise<any> {
    this.auth.authState.subscribe(user => { this.user.uid = user.uid });
    return this.userDao.getUserById(this.user.uid);
  }

  getUserUploadedBooks() {
    let books: Book[];
    this.bookRepo.getCollectionWithIds().toPromise().then(arr => books = arr);
    this.books = books.filter(book => book.seller == this.user.uid);
  }
}
