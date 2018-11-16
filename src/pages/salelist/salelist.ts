import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { Sale } from "../../models/sale";
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";
import { User } from "../../models/user";
import {Result} from "../../models/result";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-salelist',
  templateUrl: 'salelist.html',
})
export class SalelistPage {

  public sales: Sale[];     // Filtered sales
  private allSales: Sale[]; // All sales (with no filters)
  private nextPage: string;

  private externalSales: boolean = false;

  constructor(public event: Events, public popoverCtrl: PopoverController, public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider, public user: UserdataProvider) {
  }

  ionViewCanEnter(){
    let role = this.user.getRole().name;
    return role == 'Admin' || role == 'Vendor'
  }

  ionViewDidLoad() {
    this.externalSales = this.navParams.get('external');
    let saleService: Observable<Result>;
    let user: User = this.user.getUser();
    if (this.externalSales){
      // If admin get all external sales service
      if (this.user.getRole().name == 'Admin'){
        saleService = this.rest.getAllExternalSales()
      } else {  // If not only get sales for the current user id
        saleService = this.rest.getExternalSaleList(user.id)
      }
    } else {
      // If admin get all sales service
      if (this.user.getRole().name == 'Admin'){
        saleService = this.rest.getAllSales()
      } else {  // If not only get sales for the current user id
        saleService = this.rest.getSaleList(user.id)
      }
    }
    saleService.subscribe(
      success=>{
        this.sales = success.results;
        this.allSales = success.results;
        this.nextPage = success.next
      }
    );

    this.event.subscribe('filter:approved', ()=>{
      this.sales = this.allSales.filter((sale) => sale.approved);
    });

    this.event.subscribe('filter:notapproved', ()=>{
        this.sales = this.allSales.filter((sale) => !sale.approved);
      }
    );
    this.event.subscribe('filter:all', ()=>{
        this.sales = this.allSales;
      }
    )
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create('FiltersalesPage');
    popover.present({
      ev: myEvent
    });
  }

  saleDetail(saleId: number){
    this.navCtrl.push('SaledetailsPage',{id: saleId, external: this.externalSales})
  }

  loadMoreSales(infiniteScroll){
    return this.rest.getNextPage(this.nextPage).subscribe(
      success => {
        this.allSales = this.allSales.concat(success.results);
        this.sales = this.allSales;
        this.nextPage = success.next;
        infiniteScroll.complete()
      }
    )
  }
}
