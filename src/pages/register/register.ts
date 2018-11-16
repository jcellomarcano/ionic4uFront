import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Register } from "../../models/register";
import { RestProvider } from "../../providers/rest/rest";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  public registerForm: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public navParams: NavParams, private rest: RestProvider, private toastCtrl: ToastController) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password1: ['', Validators.required],
      password2: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
    });
  }

  login(){
    this.navCtrl.setRoot('LoginPage',{},{animate:true, direction:'back'})
  }

  register(){
    let registerData : Register = {
      username: this.registerForm.value.username,
      password1: this.registerForm.value.password1,
      password2: this.registerForm.value.password2,
      email: this.registerForm.value.email,
      first_name: this.registerForm.value.first_name,
      last_name: this.registerForm.value.last_name,
    };
    this.rest.register(registerData).subscribe(
      sucess => {
        this.toastCtrl.create({
          message: 'Revise su correo para confirmar su registro',
          duration: 3000,
          position: 'middle'
        }).present();
        this.navCtrl.setRoot('LoginPage')
      },
      err => {
        let msg = 'Error con el registro intente mas tarde';
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
