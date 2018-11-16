import { Component } from '@angular/core';
import { AlertController, Events, IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Currency } from "../../models/currency";
import { Country } from "../../models/country";
import { RestProvider } from "../../providers/rest/rest";
import { UserdataProvider } from "../../providers/userdata/userdata";
import { Sale } from "../../models/sale";
import 'rxjs/add/operator/mergeMap';

@IonicPage()
@Component({
  selector: 'page-sale-external',
  templateUrl: 'sale-external.html',
})
export class SaleExternalPage {

  public countries: Country[];
  public currencies: Currency[];
  public total: number = 0.00;
  public aditionalCharge: number = 0.00;
  public aditionalSale: number = 0.00;
  public countryFormGroup: FormGroup;
  public clientDataFormGroup: FormGroup;
  public saleTypeFormGroup: FormGroup;
  public saleType;
  public chargeTypes;
  public img1: any;
  public imageFile: File;

  constructor(public navCtrl: NavController,
              public events: Events,
              private formBuilder: FormBuilder,
              private alertCtrl: AlertController,
              public navParams: NavParams,
              private rest: RestProvider,
              private userData: UserdataProvider,
              private toastCtrl: ToastController,) {
    this.countryFormGroup = this.formBuilder.group({
      country: ['', Validators.required],
      currency: ['', Validators.required],
    });

    this.clientDataFormGroup = this.formBuilder.group({
      client: ['', Validators.required],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      comment: ['', Validators.required]
    });

    this.saleTypeFormGroup = this.formBuilder.group({
      index_charge: [null, Validators.required],
      index_sale: [null, Validators.required],
      dep_amount: [''],
      dep_reference: [''],
    });

    this.chargeTypes = [
      {
        name: "Envío por vendedor",
        charge_type: "Se",
        charges: 0
      },
      {
        name: "Envío internacional",
        charge_type: "Sx",
        charges: 4
      },
    ];

    this.saleType = [
      {
        name: "Depósito",
        sale_type: "S",
        charges: 2.5
      },
      {
        name: "Créditos",
        sale_type: "C",
        charges: 0
      }
    ]
  }

  ionViewCanEnter() {
    let role = this.userData.getRole().name;
    return role == 'Admin' || role == 'Vendor'
  }

  ionViewWillEnter() {
    this.events.publish('chat:disable')
  }

  ionViewWillLeave() {
    this.events.publish('chat:enable')
  }

  ionViewDidLoad() {
    this.rest.getCountries().subscribe(
      result => {
        this.countries = result.filter(country => ['ve', 'pa', 'co', 'us'].indexOf(country.code) >= 0)
        let country = this.navParams.get('country');
        this.countryFormGroup.patchValue({country: this.getCountryCode(country)})
      }
    ); //TODO: Add remaining countries
    this.rest.getCurrencies().subscribe(
      result=>{
        this.currencies = result.filter(currency => ['USD'].indexOf(currency.code) >= 0)
      }
    )//TODO: First version only USD
    // Set information from directory or stored info
    let client = this.navParams.get('client');
    let phone = this.navParams.get('phone');
    let address = this.navParams.get('address');
    this.clientDataFormGroup.patchValue({client: client, phone: phone, address: address})
  }

  executeSale() {
    let alert = this.alertCtrl.create({
      title: 'Registrar venta',
      message: '¿Esta seguro que desea registrar esta venta? No podrá realizar cambios a la venta una vez aceptado',
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
            this.registerSale();
          }
        }
      ]
    });
    alert.present();
  }

  private registerSale() {
    let sale: Sale = this.createSale();
    let vendorId = this.userData.getUser().id;
    this.rest.registerSaleExternal(vendorId, sale)
      .mergeMap(saleResult => this.rest.updateExternalSaleVoucher(saleResult.id, this.imageFile))
      .subscribe(
      success => {
        let toast = this.toastCtrl.create({
          message: 'Venta registrada correctamente',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('SalelistPage', {external: true});
      },
      error => {
        let errorMsg: string;
        let detail: string = error.error.detail;
        if (detail == null) {
          errorMsg = 'Error del servidor intente mas tarde';
          if (error.error.dep_amount != null){
            errorMsg = 'Debe indicar el monto del depósito';
          } else if (error.error.dep_reference != null) {
            errorMsg = 'Debe indicar una referencia de depósito';
          }
        } else if (detail.startsWith('Deposit')) {
          errorMsg = 'Debe depositar un mínimo de ' + (this.aditionalSale + this.aditionalCharge) + ' ' + this.countryFormGroup.value.currency + ' e indicar el número de referencia'
        } else if (detail.startsWith('User has no')) {
          errorMsg = 'Usted no posee creditos en esta moneda'
        } else if (detail.startsWith('User Credit')) {
          errorMsg = 'Usted no posee el crédito suficiente para realizar esta venta'
        }
        let toast = this.toastCtrl.create({
          message: errorMsg,
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    );
  }

  private createSale(): Sale {

    let vendorId = this.userData.getUser().id;
    let clientData = this.clientDataFormGroup.value;
    let countryData = this.countryFormGroup.value;
    let index_charge = this.saleTypeFormGroup.value.index_charge;
    let index_sale = this.saleTypeFormGroup.value.index_sale;
    let dep_amount = this.saleTypeFormGroup.value.dep_amount;
    let dep_reference = this.saleTypeFormGroup.value.dep_reference;

    if (index_sale == 1) { // When if credit sale (no deposit)
      dep_amount = 0;
      dep_reference = 'Ninguno';
    } //TODO: Revisar cuando es venta con credito

    let sale: Sale = {
      vendor: vendorId,
      client: clientData.client,
      phone: clientData.phone,
      country: this.getCountryId(countryData.country), // currency id
      currency: this.getCurrencyId(countryData.currency), // country id
      address: clientData.address,
      dep_amount: dep_amount,    // amount of the deposit, if needed.
      dep_reference: dep_reference, // deposit reference, if needed.
      charge_type: this.getChargeType(index_charge, index_sale),  // charge types: Se, Sx, Sh, Si
      sale_type: this.saleType[index_sale].sale_type,   // S : Standar, C: Credit,
      comment: clientData.comment
    };
    //console.log(sale);
    return sale
  }
  openDirectory(){
    this.navCtrl.push('ClientSearchPage', {external: true})
  }

  //TODO: review this function
  private getChargeType(indexCharge: number, indexSale: number){
    if (this.saleType[indexSale].sale_type == 'C'){
      if(this.chargeTypes[indexCharge].charge_type == 'Se'){
        return 'Sh'
      }else if (this.chargeTypes[indexCharge].charge_type == 'Sx'){
        return 'Si'
      }
    }
    return this.chargeTypes[indexCharge].charge_type
  }

  private getCurrencyId(currencyCode: string): number {
    for (let i in this.currencies) {
      if (this.currencies[i].code == currencyCode) {
        return this.currencies[i].id
      }
    }
    return null
  }

  private getCountryId(countryCode: string): number {
    for (let i in this.countries) {
      if (this.countries[i].code == countryCode) {
        return this.countries[i].id
      }
    }
    return null
  }

  updateAditionalCharge(chargeIndex: number){
    this.aditionalCharge = this.chargeTypes[chargeIndex].charges
  }

  updateAditionalSale(saleIndex: number){
    this.aditionalSale = this.saleType[saleIndex].charges
  }

  private getCountryCode(countryID: number): string{
    for (let i in this.countries){
      if (this.countries[i].id == countryID){
        return this.countries[i].code
      }
    }
    return null
  }

  fileChange(event){
    if(event.target.files && event.target.files[0]){
      let reader = new FileReader();

      reader.onload = (event:any) => {
        this.img1 = event.target.result;
      };
      reader.readAsDataURL(event.target.files[0]);
    }
    let fileList: FileList = event.target.files;
    this.imageFile = fileList[0];
  }
}

