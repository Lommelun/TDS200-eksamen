import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Book } from '../../models/book';
import { UserDaoProvider } from '../../providers/firestore/user-dao';
import { User } from '../../models/user';
import Moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-book-details',
  templateUrl: 'book-details.html'
})
export class BookDetailsPage {
  book: Book = {} as Book;
  seller: User = {} as User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDao: UserDaoProvider
  ) {
    console.log(navParams.get('book'));
    this.book = navParams.get('book');
    console.log(this.book);
    this.userDao.getUserById(this.book.seller).then(user => {
      this.seller = (user.exists) ? user.data() : null;
    }).catch(err => console.log(err));
  }

}
