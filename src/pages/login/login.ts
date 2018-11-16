import { Component } from '@angular/core';
import { Events, IonicPage, MenuController, NavController, ToastController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Authentication } from "../../models/authentication";
import { AuthProvider } from "../../providers/auth/auth";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public user: Authentication;

  constructor(public navCtrl: NavController,
              public rest: RestProvider,
              public auth: AuthProvider,
              private toastCtrl: ToastController,
              public menuCtrl: MenuController,
              public events: Events) {

    this.user = {
      username: "",
      password: ""
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
    this.events.publish('chat:disable')
  }

  register(){
    this.navCtrl.setRoot('RegisterPage')
  }

  forgotPassword(){
    this.navCtrl.setRoot('ForgotPasswordPage')
  }

  login() {
    this.rest.authentication(this.user.username, this.user.password).subscribe(
      sucess => {
        this.auth.setToken(sucess.key);     // Store user token
        this.events.publish('user:login'); // Inform main component user is logged
      },
      error => {
        if (error.status == 400) {
          let toast = this.toastCtrl.create({
            message: 'Usuario o contraseña incorrecta',
            duration: 3000
          });
          toast.present();
        } else {

          let toast = this.toastCtrl.create({
            message: 'No se ha podido establecer una conexión',
            duration: 3000
          });
          toast.present();
        }
      }
    );
  }

}
