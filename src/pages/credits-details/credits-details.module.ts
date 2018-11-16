import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreditsDetailsPage } from './credits-details';

@NgModule({
  declarations: [
    CreditsDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(CreditsDetailsPage),
  ],
})
export class CreditsDetailsPageModule {}
