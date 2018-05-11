import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { User } from '../../models/user';
import { firestore } from 'firebase/app';

/*
  A user repository provider for fetching and manipulating data from the user collection
  in firebase.
*/
@Injectable()
export class UserDaoProvider {

  constructor(private firebase: AngularFirestore) { }

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
  getUserById(uid: string): Promise<any> {
    return this.firebase.collection('users')
      .doc(uid)
      .ref.get();
  }

  // Adds a user object to the database and appends timestamps
  add(user: User, uid: string): Promise<void> {
    console.log('getting timestamp')
    let timestamp: firestore.FieldValue = firestore.FieldValue.serverTimestamp();
    console.log('adding...')
    console.log('adding...')
    return this.firebase.collection('users').doc(uid).set({
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
