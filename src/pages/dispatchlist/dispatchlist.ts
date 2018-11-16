import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Sale } from "../../models/sale";
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage()
@Component({
  selector: 'page-dispatchlist',
  templateUrl: 'dispatchlist.html',
})
export class DispatchlistPage {

  public sales: Sale[];
  private nextPage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public user: UserdataProvider) {
  }

  ionViewDidEnter(){
    this.rest.getPendingDispatch().subscribe(
      response => {
        this.sales = response.results;
        this.nextPage = response.next;
      }
    )
  }
  //Check if Dispatch role
  ionViewCanEnter(){
    return this.user.getRole().name == 'Dispatch';
  }

  saleDetail(saleId: number){
    this.navCtrl.push('SaledetailsPage', {id: saleId})
  }

  loadMoreSales(infiniteScroll){
    return this.rest.getNextPage(this.nextPage).subscribe(
      success => {
        this.sales = this.sales.concat(success.results);
        this.nextPage = success.next;
        infiniteScroll.complete();
      }
    )
  }
}
