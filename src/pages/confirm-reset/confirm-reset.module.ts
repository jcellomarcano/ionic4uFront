import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfirmResetPage } from './confirm-reset';

@NgModule({
  declarations: [
    ConfirmResetPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfirmResetPage),
  ],
})
export class ConfirmResetPageModule {}
