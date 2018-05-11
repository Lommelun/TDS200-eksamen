import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class FireStorageProvider {

  constructor(private firestorage: AngularFireStorage) { }

  /* 
  Puts the specified file with the specified path/reference 
  into Firebase Storage and returns the download task promise
  */
  uploadAsDataUrl(fileRef: string, dataUrl: string): Promise<string> {
    let ref = this.firestorage.ref(fileRef);
    let task = ref.putString(dataUrl, 'data_url');
    return task.downloadURL().toPromise();
  }
}
