import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClientAddPage } from './client-add';

@NgModule({
  declarations: [
    ClientAddPage,
  ],
  imports: [
    IonicPageModule.forChild(ClientAddPage),
  ],
})
export class ClientAddPageModule {}
