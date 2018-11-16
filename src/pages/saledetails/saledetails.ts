import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Sale } from "../../models/sale";
import { RestProvider } from "../../providers/rest/rest";
import { ProductOrder } from "../../models/product-order";
import { AuthProvider } from "../../providers/auth/auth";
import { UserdataProvider } from "../../providers/userdata/userdata";
import { Observable } from "rxjs/Observable";

@IonicPage({
  segment: 'saledetails/:id'
})
@Component({
  selector: 'page-saledetails',
  templateUrl: 'saledetails.html',
})

export class SaledetailsPage {

  public sale: Sale;
  private saleId: number;
  public country: Observable<String>;
  public saleType: any;
  public vendor: string;
  public admin: boolean;
  public dispatch: boolean;
  public products: ProductOrder[];

  public realUrl;
  public externalSale: boolean = false;


  constructor(public alertCtrl: AlertController, public navCtrl: NavController, public navParams: NavParams, public auth: AuthProvider, public rest: RestProvider, public toastCtrl: ToastController, public user: UserdataProvider) {
    this.saleType = [
      {
        name: "Producto 4U con envío",
        sale_type: "S",
        charge_type: "Sh",
        charges: 3
      },
      {
        name: "Producto 4U sin envío",
        sale_type: "S",
        charge_type: "Na",
        charges: 0
      },
      {
        name: "Producto 4U en créditos con envío",
        sale_type: "C",
        charge_type: "Sh",
        charges: 3
      },
      {
        name: "Producto 4U en créditos sin envío ",
        sale_type: "C",
        charge_type: "Na",
        charges: 0
      },
      {
        name: "Venta externa envío por vendedor",
        sale_type: "S",
        charge_type: "Se",
        charges: 2.5
      },
      {
        name: "Venta externa envío internacional",
        sale_type: "S",
        charge_type: "Sx",
        charges: 6.5
      },
      {
        name: "Venta externa en créditos envío por vendedor",
        sale_type: "C",
        charge_type: "Sh",
        charges: 0
      },
      {
        name: "Venta externa en créditos envío internacional",
        sale_type: "C",
        charge_type: "Si",
        charges: 4
      },
    ];
    this.realUrl = this.rest.realurl;
  }

  ionViewCanEnter() {
    return this.auth.isAuthenticated()
  }

  ionViewDidEnter() {
    this.saleId = this.navParams.get('id');
    this.externalSale = this.navParams.get('external');
    if (this.externalSale) {
      this.rest.getExternalSaleDetails(this.saleId).subscribe(
        success => {
          this.sale = success;
          this.products = this.sale.products;
          this.country = this.getCountry(this.sale.country);
          this.rest.getUserDetail(this.sale.vendor).subscribe(
            success => {
              this.vendor = success.first_name + ' ' + success.last_name;
            }
          );
        }
      );
    } else {
      this.rest.getSaleDetails(this.saleId).subscribe(
        success => {
          this.sale = success;
          this.products = this.sale.products;
          this.country = this.getCountry(this.sale.country);
          this.rest.getUserDetail(this.sale.vendor).subscribe(
            success => {
              this.vendor = success.first_name + ' ' + success.last_name;
            }
          );
        }
      );
    }

    // Get user data to hide or unhide dispatch and approve buttons
    this.admin = this.user.getRole().name == 'Admin';
    this.dispatch = this.user.getRole().name == 'Dispatch';
  }

  getSaleType(sale_type: string, charge_type: string): string {
    for (let i in this.saleType) {
      if (this.saleType[i].sale_type == sale_type && this.saleType[i].charge_type == charge_type) {
        return this.saleType[i].name;
      }
    }
    return ""
  }

  getSaleT(sale_type: string): string {
    if (sale_type == 'S') {
      return 'Depósito'
    } else if (sale_type == 'C') {
      return 'Crédito'
    } else if (sale_type == 'M') {
      return 'Depósito y Crédito'
    }
    return ''
  }

  getChargeT(charge_type: string): string {
    if (charge_type == 'Na') {
      return 'Envío por vendedor'
    } else if (charge_type == 'Sh') {
      return 'Envío nacional'
    } else if (charge_type == 'Si') {
      return 'Envío internacional'
    } else if (charge_type == 'Sx'){
      return 'Envío internacional producto ext.'
    } else if (charge_type == 'Se'){
      return 'Envío por vendedor producto ext'
    }
    return ''
  }

  getProductDetail(id: number): Promise<String> {
    return this.rest.getProductDetail(id).toPromise().then(
      detail => {
        return detail.name;
      }
    );
  }

  notifyDispatch() {
    this.navCtrl.push('DispatchPage', {id: this.saleId})
  }

  approveSale() {
    let alert = this.alertCtrl.create({
      title: 'Aprobar venta',
      message: '¿Esta seguro que desea aprobar esta venta?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            if (this.externalSale){
              this.approveExternalSale()
            } else {
              this.approveNormalSale()
            }
          }
        }
      ]
    });
    alert.present();
  }

  private approveNormalSale(){
    this.rest.approveSale(this.saleId, this.sale.comment).subscribe(
      success => {
        let toast = this.toastCtrl.create({
          message: 'Venta aprobada correctamente',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('SalelistPage');
      }
    )
  }

  private approveExternalSale(){
    this.rest.approveExternalSale(this.saleId, this.sale.comment).subscribe(
      success => {
        let toast = this.toastCtrl.create({
          message: 'Venta externa aprobada correctamente',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('SalelistPage', {external: true});
      }
    )
  }

  // To remove only not approved sales
  removeSale(){
    let alert = this.alertCtrl.create({
      title: 'Cancelar venta',
      message: '¿Esta seguro que desea cancelar esta venta?. Esta accion es irreversible',
      buttons: [
        {
          text: 'Atrás',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Aceptar',
          handler: () => {
            if (this.externalSale){
              this.removeExternalSale()
            } else {
              this.removeNormalSale()
            }
          }
        }
      ]
    });
    alert.present();
  }

  private removeExternalSale(){
    this.rest.deleteExternalSale(this.saleId).subscribe(
      success => {
        let toast = this.toastCtrl.create({
          message: 'Venta eliminada',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('SalelistPage', {external: true});
      }
    )
  }

  private removeNormalSale(){
    this.rest.deleteSale(this.saleId).subscribe(
      success => {
        let toast = this.toastCtrl.create({
          message: 'Venta eliminada',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('SalelistPage');
      }
    )
  }

  public getCountry(id: number) : Observable<String> {
    return this.rest.getCountries().map(
      result => result.filter(country => country.id == id)[0].name
    )
  }

  public positiveNumber(value: number) {
    if (value < 0) {
      return 0
    }
    return value
  }
}
