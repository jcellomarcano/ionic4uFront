import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { Currency } from "../../models/currency";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage({
  segment: 'transfer/:id'
})
@Component({
  selector: 'page-transfer',
  templateUrl: 'transfer.html',
})

export class TransferPage {

  user2 : number;
  user2name: string;
  public currencies: Currency[];
  public form: FormGroup;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private alertCtrl: AlertController,
              public rest: RestProvider,
              private currentUser: UserdataProvider,
              public events: Events) {

    this.form = this.formBuilder.group({
      amount: ['', [Validators.required, Validators.min(0)]],
      currency: ['', Validators.required],
    });
  }

  ionViewCanEnter(){
    return this.navParams.get('id') != null;
  }

  ionViewDidLoad() {
    this.user2 = this.navParams.get('id');
    this.user2name = this.navParams.get('username');
    this.rest.getCurrencies().subscribe(
      result=>{
        this.currencies = result.filter(currency => ['USD'].indexOf(currency.code) >= 0) // TODO: Add remaining currencies
      }
    )
  }

  transfer(){
    let values = this.form.value;
    this.rest.sendTransfer(this.currentUser.getUser().id, this.user2, values.currency, values.amount).subscribe(
      sucess => {
        let cName = this.currencies.find(currency => currency.id == values.currency).code;
        let alert = this.alertCtrl.create({
          title: 'Información',
          subTitle: `Ha transferido correctamente ${values.amount} ${cName} a ${this.user2name}`,
          buttons: [
            {
              text: 'Aceptar',
              handler: () => {
                this.navCtrl.setRoot('TransferSearchUserPage');
                setTimeout(() => this.events.publish('user:update_credit'), 8000); // update balance
              }
            }
          ]
        });
        alert.present();
      },
      error => {
        let alert = this.alertCtrl.create({
          title: 'Lo sentimos',
          subTitle: `Error en la transferencia intente mas tarde`,
          buttons: [
            {
              text: 'Aceptar',
              role: 'cancel'
            }
          ]
        });
        alert.present();
      },
    )
  }

}
