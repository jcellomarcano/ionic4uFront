import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchSalePage } from './search-sale';

@NgModule({
  declarations: [
    SearchSalePage,
  ],
  imports: [
    IonicPageModule.forChild(SearchSalePage),
  ],
})
export class SearchSalePageModule {}
