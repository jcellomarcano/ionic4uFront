import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SalelistPage } from './salelist';

@NgModule({
  declarations: [
    SalelistPage,
  ],
  imports: [
    IonicPageModule.forChild(SalelistPage),
  ],
})
export class SalelistPageModule {}
