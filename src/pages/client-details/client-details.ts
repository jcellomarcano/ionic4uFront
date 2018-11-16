import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";
import { Country } from "../../models/country";

@IonicPage({
  segment: 'client/:id'
})
@Component({
  selector: 'page-client-details',
  templateUrl: 'client-details.html',
})
export class ClientDetailsPage {

  id: number; // Client id
  name: string;
  reference: string;
  countries: Country[];
  public todo: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public rest: RestProvider, public user: UserdataProvider, private toastCtrl: ToastController) {
    this.todo = this.formBuilder.group({
      client: ['', Validators.required],
      phone: ['', Validators.required],
      country: [null, Validators.required],
      address: ['', Validators.required],
    });
  }

  ionViewCanEnter(){
  }

  ionViewDidEnter(){
    this.id = this.navParams.get('id');
    this.rest.getClient(this.id).subscribe(
      result => {
        this.todo.setValue({
        client: result.client,
        phone: result.phone,
        country: result.country,
        address: result.address
        });
        this.name = result.client

    })
    this.rest.getCountries().subscribe(
      result => this.countries = result.filter(country => ['ve', 'pa', 'co', 'us'].indexOf(country.code) >= 0) // TODO: add remaining countries
    )
  }

  updateClient() {
    let val = this.todo.value;
    this.rest.updateClient(this.id, val.client, val.phone, val.country, val.address).subscribe(
      sucess => {
        this.toastCtrl.create({
          message: 'Ha sido guardada la información del cliente',
          duration: 3000,
          position: 'top'
        }).present();
      },
      error => {
        console.log('error')
        //TODO: Agregar popup de error
      }
    )
  }

  selectClient(){
    let client = this.todo.value;
    let externalSale = this.navParams.get('external');
    let page = 'SalePage';
    if (externalSale){
      page = 'SaleExternalPage'
    }
    this.navCtrl.setRoot(page, {
      client: client.client,
      phone: client.phone,
      address: client.address,
      country: client.country
    })
  }

  deleteClient(){
    this.rest.deleteClient(this.id).subscribe(
      success => {
        this.toastCtrl.create({
          message: 'El cliente ha sido eliminado',
          duration: 3000,
          position: 'top'
        }).present();
        this.navCtrl.pop()
      }
    )
  }
}
