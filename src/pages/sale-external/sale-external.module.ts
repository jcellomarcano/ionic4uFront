import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaleExternalPage } from './sale-external';

@NgModule({
  declarations: [
    SaleExternalPage,
  ],
  imports: [
    IonicPageModule.forChild(SaleExternalPage),
  ],
})
export class SaleExternalPageModule {}
