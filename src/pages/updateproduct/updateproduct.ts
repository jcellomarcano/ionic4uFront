import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Product } from "../../models/product";
import { RestProvider } from "../../providers/rest/rest";

@IonicPage({
  segment: 'updateproduct/:id'
})
@Component({
  selector: 'page-updateproduct',
  templateUrl: 'updateproduct.html',
})
export class UpdateproductPage {

  id : number;
  name: string;
  reference: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider) {
  }

  ionViewCanEnter(){
    return this.navParams.get('id') != null;
  }

  ionViewDidLoad() {
    let id = this.navParams.get('id');
    this.rest.getProductDetail(id).subscribe(
      product => {
        this.name = product.name;
        this.reference = product.reference;
      }
    )
  }

  updateProduct(){
    let product : Product = {
      id : this.id,
      name: this.name,
      reference: this.reference
    };
    this.rest.updateProduct(product).subscribe(
      success => {
        this.navCtrl.pop();
      }
    )
  }

}
