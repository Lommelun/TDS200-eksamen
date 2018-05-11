import { Component } from '@angular/core';
import firebase from 'firebase/app';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Book } from '../../models/book';
import { User } from '../../models/user';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import { UserDaoProvider } from '../../providers/firestore/user-dao';

@IonicPage()
@Component({
  selector: 'page-book-details',
  templateUrl: 'book-details.html'
})
export class BookDetailsPage {
  book: Book;
  seller: User;
  currentUserId: string = firebase.auth().currentUser.uid;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private userDao: UserDaoProvider,
    private bookRepo: BookRepositoryProvider,
    private toast: ToastController
  ) {
    this.seller = { username: '', name: '', age: null, address: { street: '', city: '' }, image: '' } as User;

    // Gets the book passed into the navparams when navigating here and stores it locally
    this.book = navParams.get('book');

    // Gets the user info of the seller and stores locally
    this.userDao.getUserById(this.book.seller).then(user => {
      this.seller = (user.exists) ? user.data() : null;
    }).catch(err => console.log(err));
  }

  /*
  Provides a deletion of the book if the user is the currently logged in user. 
  Probably needs more security checking
  */
  deleteBook(book: Book) {
    this.bookRepo.delete(book.id);
    this.navCtrl.pop();
    this.toast.create({
      message: 'Slettet!',
      duration: 800
    }).present();
  }

}
