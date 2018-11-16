import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from "../../providers/rest/rest";

@IonicPage({
  segment: 'confirmreset/:params'
})
@Component({
  selector: 'page-confirm-reset',
  templateUrl: 'confirm-reset.html',
})
export class ConfirmResetPage {

  todo: FormGroup;
  uid: string;
  token: string;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public navParams: NavParams, private rest: RestProvider, private toastCtrl: ToastController) {
    this.todo = this.formBuilder.group({
      password1: ['', Validators.required],
      password2: ['', Validators.required]
    });
  }

  ionViewWillEnter() {
  }

  ionViewCanEnter(){
    let params = this.navParams.get('params');
    if (params == null){
      return false
    }
    // Check url has the following format uid=12&token=ABC
    let searchParams = new URLSearchParams(params); // TODO: Puede traer problemas para IOS revisar
    this.uid = searchParams.get("uid");
    this.token = searchParams.get("token");
    return searchParams.has("uid") && searchParams.has("token");
  }

  loginPage(){
    this.navCtrl.setRoot('LoginPage',{},{animate:true, direction:'back'})
  }

  confirmResetPassword(){
    this.rest.confirmReset(this.token, this.uid, this.todo.value.password1, this.todo.value.password2).subscribe(
      sucess => {
        this.toastCtrl.create({
          message: 'Su contraseña ha sido cambiado con éxito',
          duration: 3000,
          position: 'middle'
        }).present();
        this.navCtrl.setRoot('LoginPage')
      },
      err => {
        let msg = 'Error con el cambio de contraseña intente mas tarde';
        if (err.status == 400){
          msg = err.error[Object.keys(err.error)[0]]
        }
        this.toastCtrl.create({
          message: msg,
          duration: 3000,
          position: 'bottom'
        }).present();
      }
    )
  }
}
