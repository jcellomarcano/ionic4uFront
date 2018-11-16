import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { UserdataProvider } from "../../providers/userdata/userdata";
import { RestProvider } from "../../providers/rest/rest";


@IonicPage({
  segment: 'dispatch/:id',
  defaultHistory: ['dispatchlist']
})
@Component({
  selector: 'page-dispatch',
  templateUrl: 'dispatch.html',
})
export class DispatchPage {

  id: number;
  img1: any;
  imageFile: File;
  comment: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public user: UserdataProvider, public rest: RestProvider, public toastCtrl: ToastController) {
  }

  ionViewCanEnter() {
    return this.user.getRole().name == 'Dispatch';
  }

  ionViewDidEnter() {
    this.id = this.navParams.get('id');
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

  updateSaleTracking(){
    this.rest.updateSaleTracking(this.id, this.comment, this.imageFile).subscribe(
      success => {
        let toast = this.toastCtrl.create({
          message: 'Envío notificado correctamente',
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.setRoot('DispatchlistPage');
      }
    )
  }

}
