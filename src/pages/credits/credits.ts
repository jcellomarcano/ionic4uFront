import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Country } from "../../models/country";
import { RestProvider } from "../../providers/rest/rest";
import { User } from "../../models/user";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage()
@Component({
  selector: 'page-credits',
  templateUrl: 'credits.html',
})
export class CreditsPage {

  countries : Country[];
  vendors : User[];
  nextPage: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public user: UserdataProvider ) {
  }

  ionViewDidLoad() {
    this.rest.getCountries().subscribe(
      response => {
        this.countries = response;
        this.rest.getVendorsList().subscribe(
          response => {
            this.vendors = response.results;
            this.nextPage = response.next
          }
        );
      }
    );
  }

  //Check if Admin
  ionViewCanEnter(){
    return this.user.getRole().name == 'Admin';
  }

  creditDetail(vendorId: number, vendor_name: string){
    this.navCtrl.push('CreditsDetailsPage', {vendor: vendorId, vendor_name: vendor_name})
  }

  loadMoreVendors(infiniteScroll){
    return this.rest.getNextPage(this.nextPage).subscribe(
      success => {
        this.vendors = this.vendors.concat(success.results);
        this.nextPage = success.next;
        infiniteScroll.complete()
      }
    )
  }

}
