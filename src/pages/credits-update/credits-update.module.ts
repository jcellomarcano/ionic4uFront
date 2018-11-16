import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditsUpdatePage } from './credits-update';

@NgModule({
  declarations: [
    CreditsUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(CreditsUpdatePage),
  ],
})
export class CreditsUpdatePageModule {}
