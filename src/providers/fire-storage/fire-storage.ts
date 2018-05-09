import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';

@Injectable()
export class FireStorageProvider {

  constructor(public firestorage: AngularFireStorage) { }

  uploadImageAsRawBase64(name: string, file: string): AngularFireUploadTask {
    let task = null;
    return task;
  }

}
