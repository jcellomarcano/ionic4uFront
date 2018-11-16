import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Credit } from "../../models/credit";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage({
  segment: 'creditdetail/:vendor'
})
@Component({
  selector: 'page-credits-details',
  templateUrl: 'credits-details.html',
})
export class CreditsDetailsPage {

  vendor_id: number;
  vendor_name: string;
  vendor_credits : Credit[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public user: UserdataProvider) {
  }

  //Check if Admin
  ionViewCanEnter(){
    return this.user.getRole().name == 'Admin';
  }

  ionViewDidEnter() {
    this.vendor_id = this.navParams.get('vendor');
    this.vendor_name = this.navParams.get('vendor_name');
    this.rest.getVendorCredit(this.vendor_id).subscribe(
      response => this.vendor_credits = response
    )
  }

  updateCredit(creditId: number, currencyCode: string){
    this.navCtrl.push('CreditsUpdatePage', {'credit': creditId, 'vendor': this.vendor_id, 'currency': currencyCode})
  }

}
