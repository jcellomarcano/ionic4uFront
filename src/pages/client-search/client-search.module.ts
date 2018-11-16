import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientSearchPage } from './client-search';

@NgModule({
  declarations: [
    ClientSearchPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientSearchPage),
  ],
})
export class ClientSearchPageModule {}
