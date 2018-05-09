import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../models/book';
// import { FieldValue } from '@firebase/firestore-types';

/*
  A book repository provider for fetching and manipulating data from the book collection
  in firebase. Also provides a locally cached Observable from the collection.
*/

@Injectable()
export class BookRepositoryProvider {
  book: Book = {} as Book;
  books: Observable<Book[]>;

  constructor(private firebase: AngularFirestore) {
    /* Enables a local persistence cache that can hold loaded documents and collections, 
       keep updates and additions to update later */
    firebase.firestore.enablePersistence()
      .then(success => console.info('Enabled offline persistence cache', success))
      .catch(error => console.warn('Could not enable offline persistence cache', error));

    this.cacheCollectionWithIds();
  }

  cacheCollectionWithIds(): void {
    this.books = this.getCollectionWithIds();
  }

  // Returns an Observable that emits the collection data with id's prepended
  getCollectionWithIds(): Observable<Book[]> {
    return this.firebase.collection('books')
      .snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as Book;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      });
  }

  // Returns an Observable that emits only the collection data
  getCollection(): Observable<Book[]> {
    return this.firebase.collection<Book>('books').valueChanges();
  }

  // Adds a book object to the database and appends timestamps
  add(book: Book): void {
    // let timestamp: FieldValue = FieldValue.serverTimestamp();
    this.firebase.collection('books').add({
      ...book,
      // updatedAt: timestamp,
      // createdAt: timestamp
    }).catch(error => console.error(error));
  }

  // Updates an existing book from Book object and updates timestamp
  update(book: Book): void {
    // let timestamp: FieldValue = FieldValue.serverTimestamp();
    this.firebase.doc('books/' + book.id).update({
      ...book,
      // updatedAt: timestamp
    }).catch(error => console.error(error));
  }

}
