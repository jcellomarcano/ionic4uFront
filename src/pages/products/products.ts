import { Component } from '@angular/core';
import { AlertController, IonicPage, MenuController, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { AuthProvider } from "../../providers/auth/auth";
import { Product } from "../../models/product";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage()
@Component({
  selector: 'page-products',
  templateUrl: 'products.html',
})
export class ProductsPage {

  products: Product[];
  nextPage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public menuCtrl: MenuController, public rest: RestProvider, private alertCtrl: AlertController, public user: UserdataProvider) {
  }

  ionViewWillEnter(){
    this.rest.getProducts().subscribe(
      response => {
        this.products = response.results;
        this.products.sort((a, b) => a.id - b.id);
        this.nextPage = response.next;
      }
    )
  }

  ionViewCanEnter(){
    return this.user.getRole().name == 'Admin';
  }

  ionViewDidEnter(){
    this.menuCtrl.enable(true);
  }

  checkProductPrices(productId: number, prodName: string){
    this.navCtrl.push('PricesPage', {productId: productId, productName: prodName})
  }

  updateProduct(product: Product){
    this.navCtrl.push('UpdateproductPage', {id: product.id})
  }

  deleteProduct(productId: number, productRef: string){
    let alert = this.alertCtrl.create({
      title: 'Eliminar producto',
      message: '¿Desea eliminar el producto ' + productRef + ' ?',
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
            this.rest.deleteProduct(productId).subscribe(
              success=>{
                this.products = this.products.filter(prod => prod.id != productId);
              }
            )
          }
        }
      ]
    });
    alert.present();

  }

  addProduct(){
    this.navCtrl.push('AddproductPage')
  }

  loadMoreProducts(infiniteScroll){
    return this.rest.getNextPage(this.nextPage).subscribe(
      success => {
        this.products = this.products.concat(success.results);
        this.nextPage = success.next
        infiniteScroll.complete()
      }
    )
  }

}
