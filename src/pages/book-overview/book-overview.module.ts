import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BookOverviewPage } from './book-overview';

@NgModule({
  declarations: [
    BookOverviewPage,
  ],
  imports: [
    IonicPageModule.forChild(BookOverviewPage),
  ],
})
export class BookOverviewPageModule {}
