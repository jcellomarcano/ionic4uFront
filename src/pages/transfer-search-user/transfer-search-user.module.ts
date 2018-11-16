import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferSearchUserPage } from './transfer-search-user';

@NgModule({
  declarations: [
    TransferSearchUserPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferSearchUserPage),
  ],
})
export class TransferSearchUserPageModule {}
