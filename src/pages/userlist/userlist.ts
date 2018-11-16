import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../models/user";
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage({

})
@Component({
  selector: 'page-userlist',
  templateUrl: 'userlist.html',
})
export class UserlistPage {

  users : User[];
  nextPage : string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public user: UserdataProvider) {
  }

  //Check if Admin
  ionViewCanEnter(){
    return this.user.getRole().name == 'Admin';
  }

  ionViewDidEnter(){
    this.rest.getUserList().subscribe(
      response => {
        this.users = response.results;
        this.users.sort( (user1, user2) => this.compareUser(user1, user2)) // Sort by role and user code
        this.nextPage = response.next;
      }
    )
  }

  getRole(user: User): String{
    if (user.groups != null && user.groups.length > 0){
      return user.groups[0].name
    }
    return 'Undefined'
  }

  userDetail(userId: number){
    this.navCtrl.push('UserDetailsPage', {id : userId})
  }

  compareUser(user1: User, user2: User){
    let comp = this.getRole(user1).localeCompare(this.getRole(user2).toString());
    if (comp == 0){ // If they have the same role, sort by code
      comp = user1.profile.code.localeCompare(user2.profile.code)
    }
    return comp
  }

  loadMoreUsers(infiniteScroll){
    return this.rest.getNextPage(this.nextPage).subscribe(
      success => {
        this.users = this.users.concat(success.results.sort( (user1, user2) => this.compareUser(user1, user2)));
        this.nextPage = success.next;
        infiniteScroll.complete()
      }
    )
  }
}
