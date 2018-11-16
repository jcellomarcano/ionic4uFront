import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RestProvider } from "../../providers/rest/rest";
import { Product } from "../../models/product";
import { UserdataProvider } from "../../providers/userdata/userdata";

@IonicPage()
@Component({
  selector: 'page-addproduct',
  templateUrl: 'addproduct.html',
})
export class AddproductPage {

  name: string;
  reference: string;
  public todo: FormGroup;

  constructor(public navCtrl: NavController, private formBuilder: FormBuilder, public rest: RestProvider, public user: UserdataProvider) {
    this.todo = this.formBuilder.group({
      name: ['', Validators.required],
      reference: [''],
    });
  }

  ionViewCanEnter(){
    return this.user.getRole().name == 'Admin';
  }

  logForm() {
    let product: Product = {
      name: this.todo.value.name,
      reference: this.todo.value.reference
    };

    this.rest.addProduct(product).subscribe(
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
