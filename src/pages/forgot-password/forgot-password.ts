import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from "../../providers/rest/rest";

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  todo: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public navParams: NavParams, private rest: RestProvider, private toastCtrl: ToastController) {
    this.todo = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  loginPage() {
    this.navCtrl.setRoot('LoginPage',{},{animate:true, direction:'back'})
  }

  forgotPassword(){
    this.rest.forgotPassword(this.todo.value.email).subscribe(
      sucess => {
        this.toastCtrl.create({
          message: 'Revise su correo para recuperar su contraseña',
          duration: 3000,
          position: 'middle'
        }).present();
        this.navCtrl.setRoot('LoginPage')
      },
      err => {
        let msg = 'Error con la recuperación intente mas tarde';
        if (err.status == 400 || err.status == 404){
          msg = 'El correo introducido no es correcto, intente nuevamente'
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
