import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Room } from "../../models/room";
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage()
@Component({
  selector: 'page-chat-list',
  templateUrl: 'chat-list.html',
})
export class ChatListPage {

  rooms: Room[];
  userID: number;
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public user: UserdataProvider) {
  }

  ionViewDidEnter() {
    this.userID = this.user.getUser().id;
    this.rest.getChatRooms().subscribe(
      success => {
        this.rooms = success.results;
        for (let i in this.rooms){
          // Swap vendors if vendor2 is the same user
          if (this.rooms[i].vendor2.id == this.userID){
            let tmp = this.rooms[i].vendor1;
            this.rooms[i].vendor1 = this.rooms[i].vendor2;
            this.rooms[i].vendor2 = tmp;
          }
        }
      }
    )
  }

  openChat(room: Room){
    this.navCtrl.push('ChatPage',{
      roomId: room.id,
      toUserName: room.vendor2.username,
      toUserImage: room.vendor2.profile.profile_pic ? room.vendor2.profile.profile_pic : 'assets/imgs/defaultuser.png'
    })
  }

}
