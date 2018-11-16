import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaledetailsPage } from './saledetails';
import { IonicImageViewerModule } from "ionic-img-viewer";

@NgModule({
  declarations: [
    SaledetailsPage,
  ],
  imports: [
    IonicImageViewerModule,
    IonicPageModule.forChild(SaledetailsPage),
  ],
})
export class SaledetailsPageModule {}
