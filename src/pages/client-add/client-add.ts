import { Component } from '@angular/core';
import { IonicPage, NavController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";
import { Country } from "../../models/country";


@IonicPage()
@Component({
  selector: 'page-client-add',
  templateUrl: 'client-add.html',
})
export class ClientAddPage {

  name: string;
  reference: string;
  countries: Country[];
  public todo: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public rest: RestProvider, public user: UserdataProvider) {
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
    this.rest.getCountries().subscribe(
      result => this.countries = result.filter(country => ['ve', 'pa', 'co', 'us'].indexOf(country.code) >= 0)
    ) // TODO: Add remaining countries
  }

  logForm() {
    let val = this.todo.value
    this.rest.addClient(val.client, val.phone, val.country, val.address).subscribe(
      sucess => {
        console.log('sucess');
        this.navCtrl.pop();
      },
      error => {
        console.log('error')
        //TODO: Agregar popup de error
      }
    )
  }
}
