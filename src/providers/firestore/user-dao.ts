import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { firestore } from 'firebase/app';

/*
  A user repository provider for fetching and manipulating data from the user collection
  in firebase. Also provides a locally cached Observable from the collection.
*/
@Injectable()
export class UserDaoProvider {
  users: Observable<User[]>;

  constructor(private firebase: AngularFirestore) {
      /* 
      Enables a local persistence cache that can hold loaded documents and collections, 
      keep updates and additions to update later 
      */
    firebase.firestore.enablePersistence()
      .then(success => console.info('Enabled offline persistence cache', success))
      .catch(error => console.warn('Could not enable offline persistence cache', error));
  }

  // Returns an Observable that emits the collection data with id's prepended
  getCollectionWithIds(): Observable<User[]> {
    return this.firebase.collection('users')
      .snapshotChanges().map(actions => {
        return actions.map(action => {
          const data = action.payload.doc.data() as User;
          const id = action.payload.doc.id;
          return { id, ...data };
        });
      });
  }

  // Returns an Observable that emits only the collection data
  getUserById(uid: string): User {
    let user;
    this.firebase.collection<User>('users').doc(uid).valueChanges().subscribe(result => { user = result });
    return user;
  }

  // Adds a user object to the database and appends timestamps
  add(user: User): Promise<firestore.DocumentReference> {
    let timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    return this.firebase.collection('users').add({
      ...user,
      updatedAt: timestamp,
      createdAt: timestamp
    });
  }

  // Updates an existing user from User object and updates timestamp
  update(user: User): Promise<void> {
    let timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    return this.firebase.doc('users/' + user.uid).update({
      ...user,
      updatedAt: timestamp
    });
  }

}
