import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { BookRepositoryProvider } from '../../providers/firestore/book-repository';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../models/book';

@IonicPage()
@Component({
  selector: 'page-book-overview',
  templateUrl: 'book-overview.html',
})
export class BookOverviewPage {
  public books: Observable<Book[]>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public repo: BookRepositoryProvider
  ) {
    this.books = this.repo.books;
  }

  goToDetails(book: Book): void {
    this.navCtrl.push('BookDetailsPage', { book });
  }

}
