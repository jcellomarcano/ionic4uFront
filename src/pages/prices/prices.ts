import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Price } from "../../models/price";

@IonicPage()
@Component({
  selector: 'page-prices',
  templateUrl: 'prices.html',
})
export class PricesPage {

  public productId = 0;
  public prices: Price[];
  public productName: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private rest: RestProvider, private alertCtrl: AlertController) {
  }

  ionViewDidEnter(){
    this.productId = this.navParams.get('productId');
    this.productName = this.navParams.get('productName');
    this.rest.getPrices(this.productId).subscribe(
      response => {
        this.prices = response.results;
      }
    );
    console.log(this.navParams.get('productName'))
  }

  ionViewCanEnter(){
    return this.navParams.get('productId') != null;
  }

  addProductPrice(){
    this.navCtrl.push('AddpricePage', {productId: this.productId})
  }

  deleteProductPrice(priceId: number, country: string, currency: string, price: number){
    let alert = this.alertCtrl.create({
      title: 'Eliminar precio',
      message: `¿Desea eliminar el precio en ${country} con un valor de ${price} ${currency}`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.rest.deletePrice(this.productId, priceId).subscribe(
              success=>{
                this.prices = this.prices.filter(p => p.id != priceId);
              }
            )
          }
        }
      ]
    });
    alert.present();
  }

}
