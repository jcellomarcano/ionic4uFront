import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";


@IonicPage()
@Component({
  selector: 'page-credits-update',
  templateUrl: 'credits-update.html',
})
export class CreditsUpdatePage {

  credit_id : number;
  vendor_id : number;
  currency_name: string;
  currency_id: number;
  credit : number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public user: UserdataProvider) {
  }

  ionViewCanEnter() {
    this.credit_id = this.navParams.get('credit');
    this.vendor_id = this.navParams.get('vendor');
    this.currency_name = this.navParams.get('currency');
    if (this.credit_id == null || this.vendor_id == null || this.currency_name == null){
      return false
    }
    return this.user.getRole().name == 'Admin';
  }

  ionViewDidEnter() {
    this.rest.getCreditDetail(this.vendor_id, this.credit_id).subscribe(
      response => { this.credit = response.credit; this.currency_id = response.currency; }
    )
  }

  updateCredit() {
    this.rest.updateVendorCredit(this.vendor_id, this.credit_id, this.currency_id, this.credit).subscribe(
      success => {
        this.navCtrl.pop();
      }
    )
  }

}
