import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DispatchlistPage } from './dispatchlist';

@NgModule({
  declarations: [
    DispatchlistPage,
  ],
  imports: [
    IonicPageModule.forChild(DispatchlistPage),
  ],
})
export class DispatchlistPageModule {}
