import { Component } from '@angular/core';
import { Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from "../../providers/rest/rest";
import { Product } from "../../models/product";
import { Price } from "../../models/price";
import { ProductOrder } from "../../models/product-order";

@IonicPage()
@Component({
  selector: 'page-addorder',
  templateUrl: 'addorder.html',
})
export class AddorderPage {

  public todo: FormGroup;
  public country_code: string;
  public currency_code: string;
  public products: Product[] = [];

  constructor(public navCtrl: NavController, public events: Events, private formBuilder: FormBuilder,  public navParams: NavParams, private rest: RestProvider) {
    this.todo = this.formBuilder.group({
      country: ['', Validators.required],
      currency: ['', Validators.required],
    });
  }

  ionViewCanEnter(){
    return this.navParams.get('country_code') != null
  }

  ionViewDidLoad(){
    this.country_code = this.navParams.get('country_code');
    this.currency_code = this.navParams.get('currency_code');
    this.rest.getProductsByCountry(this.country_code).subscribe(
      sucess => {
        this.products = sucess.results
      }
    );
  }

  addItem(productId: number, name: string, price: number){
    let order: ProductOrder;
    order = {
      product: productId,
      quantity: 1,
      name: name,
      price: price
    };
    this.events.publish('order:add', order);
    this.navCtrl.pop();
  }

  // Return price in the selected currency, and country code
  public returnPrice(currency_code: string, country_code: string, prices: Price[]){
    //console.log(country_code);
    for (let i in prices){
      if (prices[i].currency_code == currency_code && prices[i].country_code == country_code){
        return prices[i].price
      }
    }
    return null;
  }
}
