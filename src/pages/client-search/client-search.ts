import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { AuthProvider } from "../../providers/auth/auth";
import { UserdataProvider } from "../../providers/userdata/userdata";
import { Client } from "../../models/client";

@IonicPage()
@Component({
  selector: 'page-client-search',
  templateUrl: 'client-search.html',
})
export class ClientSearchPage {

  clients: Client[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public auth: AuthProvider, public user: UserdataProvider) {
  }

  ionViewCanEnter(){

  }

  ionViewDidEnter(){
    this.clients = [];
    this.rest.searchClient('').subscribe(
      success => this.clients = success.results
    )
  }

  search(event: any){
    let value = event.target.value;
    this.rest.searchClient(value).subscribe(
      success => this.clients = success.results
    )
  }

  selectClient(id: number){
    let external = this.navParams.get('external');
    this.navCtrl.push('ClientDetailsPage', {'id': id, 'external': external})
  }

  addClient(){
    this.navCtrl.push('ClientAddPage')
  }

}
