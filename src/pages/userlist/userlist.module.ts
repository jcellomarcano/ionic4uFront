import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserlistPage } from './userlist';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    UserlistPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(UserlistPage),
  ],
})
export class UserlistPageModule {}
