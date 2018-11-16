import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Country } from "../../models/country";
import { RestProvider } from "../../providers/rest/rest";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Currency } from "../../models/currency";

/**
 * Generated class for the AddpricePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-addprice',
  templateUrl: 'addprice.html',
})
export class AddpricePage {

  public countries: Country[];
  public currencies: Currency[];
  private productId: number;
  public todo: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder,  public navParams: NavParams, private rest: RestProvider) {
    this.todo = this.formBuilder.group({
      price: ['', [Validators.required, Validators.min(0)]],
      country: ['', Validators.required],
      currency: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    this.rest.getCountries().subscribe(
      result => this.countries = result.filter(country => ['ve', 'pa', 'co', 'us'].indexOf(country.code) >= 0)
    ); //TODO: Add remaining countries
    this.rest.getCurrencies().subscribe(
      result=>{
        this.currencies = result
      }
    )
  }

  ionViewDidEnter() {
    this.productId = this.navParams.get('productId');
  }

  ionViewCanEnter(){
    return this.navParams.get('productId') != null;
  }

  createPrice(){
    let values = this.todo.value;
    this.rest.addPrice(this.productId, values.country, values.currency, values.price).subscribe(
      sucess => {
        console.log('sucess');
        this.navCtrl.pop();
      },
      error => {
        console.log('error')
        //TODO: Agregar popup de error
      }
    )
  }

}
