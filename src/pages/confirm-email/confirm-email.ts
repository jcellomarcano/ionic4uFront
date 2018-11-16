import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";

@IonicPage({
  segment: 'confirmemail/:params'
})
@Component({
  selector: 'page-confirm-email',
  templateUrl: 'confirm-email.html',
})
export class ConfirmEmailPage {

  private user: string;
  private token: string;
  msg: string = 'Espere un momento';
  constructor(public navCtrl: NavController, public navParams: NavParams, private rest: RestProvider) {
  }

  ionViewCanEnter(){
    let params = this.navParams.get('params');
    if (params == null){
      return false
    }
    // Check url has the following format user=121&token=ABC
    let searchParams = new URLSearchParams(params); // TODO: Puede traer problemas para IOS revisar
    this.user = searchParams.get("user");
    this.token = searchParams.get("token");
    return searchParams.has("user") && searchParams.has("token");
  }

  ionViewDidEnter(){
    this.rest.confirmEmail(this.token, this.user).subscribe(
      sucess => {
        this.msg = 'Su correo ha sido confirmado con éxito';
      },
      error => {
        this.msg = 'No se pudo realizar la verificación de correo intente nuevamente';
      }
    )
  }

  loginPage(){
    this.navCtrl.setRoot('LoginPage',{},{animate:true, direction:'back'})
  }
}
