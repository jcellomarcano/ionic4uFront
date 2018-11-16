import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { RestProvider } from "../../providers/rest/rest";
import { AuthProvider } from "../../providers/auth/auth";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage()
@Component({
  selector: 'page-chat-select-contact',
  templateUrl: 'chat-select-contact.html',
})
export class ChatSelectContactPage {

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
        this.users = success.results.filter((user: User) => user.id != this.user.getUser().id); // Dont let to chat with the same user
        console.log(this.user.getUser().id);
      }
    )
  }

  beginChat(user: User){
    this.navCtrl.setPages([
      {page: 'ChatListPage', params: {}},
      {page: 'ChatPage', params : {toUserImage: user.profile.profile_pic, 'toUserName': user.username, 'toUserId': user.id}}
    ])
  }

}
