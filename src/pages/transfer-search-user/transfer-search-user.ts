import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { RestProvider } from "../../providers/rest/rest";
import { AuthProvider } from "../../providers/auth/auth";
import { UserdataProvider } from "../../providers/userdata/userdata";

/**
 * Generated class for the TransferSearchUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  segment: 'transfer'
})
@Component({
  selector: 'page-transfer-search-user',
  templateUrl: 'transfer-search-user.html',
})
export class TransferSearchUserPage {

  users: User[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public auth: AuthProvider, public user: UserdataProvider) {
  }

  ionViewCanEnter(){

  }

  search(event: any){
    let value = event.target.value;
    if (value == ''){
      this.users = [];
      return;
    }
    this.rest.searchUser(value).subscribe(
      success => {
        this.users = success.results.filter((user: User) => user.id != this.user.getUser().id); // Dont let to transfer to the same user
      }
    )
  }

  transferUser(user: User){
    this.navCtrl.push('TransferPage', {id: user.id, username: user.username}, {animate: true});
  }

}
