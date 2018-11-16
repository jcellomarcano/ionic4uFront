import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChatSelectContactPage } from './chat-select-contact';

@NgModule({
  declarations: [
    ChatSelectContactPage,
  ],
  imports: [
    IonicPageModule.forChild(ChatSelectContactPage),
  ],
})
export class ChatSelectContactPageModule {}
