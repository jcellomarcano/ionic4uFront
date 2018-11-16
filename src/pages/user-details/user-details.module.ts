import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserDetailsPage } from './user-details';
import { PipesModule } from "../../pipes/pipes.module";

@NgModule({
  declarations: [
    UserDetailsPage,
  ],
  imports: [
    PipesModule,
    IonicPageModule.forChild(UserDetailsPage),
  ],
})
export class UserDetailsPageModule {}
