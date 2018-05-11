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
  book: Book;
  seller: User;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDao: UserDaoProvider
  ) {
    this.seller = { username: '', name: '', age: null, address: { street: '', city: '' }, image: '' } as User;
    this.book = navParams.get('book');
    this.userDao.getUserById(this.book.seller).then(user => {
      this.seller = (user.exists) ? user.data() : null;
    }).catch(err => console.log(err));
  }

}
