import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Book } from '../../models/book';
import { firestore } from 'firebase/app';

/*
  A book repository provider for fetching and manipulating data from the book collection
  in firebase. Also provides a locally cached Observable from the collection.
*/

@Injectable()
export class BookRepositoryProvider {
  books: Observable<Book[]>;

  constructor(private firebase: AngularFirestore) {
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
  add(book: Book): Promise<firestore.DocumentReference> {
    let timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    return this.firebase.collection('books').add({
      ...book,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  // Updates an existing book from Book object and updates timestamp
  update(book: Book): Promise<void> {
    let timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    return this.firebase.doc('books/' + book.id).update({
      ...book,
      updatedAt: timestamp
    });
  }

}
