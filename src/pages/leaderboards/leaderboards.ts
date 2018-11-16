import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VendorScore } from "../../models/vendor-score";
import { RestProvider } from "../../providers/rest/rest";
import { AuthProvider } from "../../providers/auth/auth";
import { Country } from "../../models/country";
import { UserdataProvider } from "../../providers/userdata/userdata";


@IonicPage()
@Component({
  selector: 'page-leaderboards',
  templateUrl: 'leaderboards.html',
})
export class LeaderboardsPage {

  vendors: VendorScore[];
  countries: Country[];
  selectedCountry: number; // Id of the selected country

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public rest: RestProvider, public user: UserdataProvider) {
  }

  ionViewCanEnter() {
    this.selectedCountry = this.user.getUser().profile.country;
    return this.auth.isAuthenticated()
  }

  ionViewDidEnter() {
    this.rest.getCountries().subscribe(
      result => this.countries = result.filter(country => ['ve', 'pa', 'co', 'us'].indexOf(country.code) >= 0)
    ); //TODO: Add remaining countries
    this.changeCountry();
  }

  changeCountry() {
    this.rest.getScoresByCountry(this.selectedCountry).subscribe(
      sucesss => {
        this.vendors = sucesss.results;
        console.log(this.vendors)
      }
    );
  }

}
