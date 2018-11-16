import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { User } from "../../models/user";
import { Role } from "../../models/role";
import { Country } from "../../models/country";
import { Observable } from "rxjs/Observable";
import { UserdataProvider } from "../../providers/userdata/userdata";
import 'rxjs/add/observable/forkJoin'
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/delay';

@IonicPage({
  segment: 'user-details/:id'
})
@Component({
  selector: 'page-user-details',
  templateUrl: 'user-details.html',
})
export class UserDetailsPage {

  disableButton: boolean = true;
  user : User;
  isAdmin: boolean;
  countries: Country[];
  username: string;
  role: String;
  originalRol : String;
  imageURI:any;
  profileImage : string;

  public roles: Role[] = [
    {value: 'Admin', name: 'Administrador'},
    {value: 'Vendor', name: 'Vendedor'},
    {value: 'Dispatch', name: 'Despacho'},
    {value: 'Bloqued', name: 'Bloqueado'}
  ];

  constructor(public navCtrl: NavController, public navParams: NavParams, public rest: RestProvider,private toastCtrl: ToastController, public currentUser: UserdataProvider) {
  }

  // getImage() {
  //   const options: CameraOptions = {
  //     quality: 100,
  //     destinationType: this.camera.DestinationType.FILE_URI,
  //     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
  //   }
  //
  //   this.camera.getPicture(options).then((imageData) => {
  //     this.imageURI = imageData;
  //   }, (err) => {
  //     console.log(err);
  //   });
  // }

  //Check if Admin or the same user
  ionViewCanEnter(){
    let id = this.navParams.get('id');
    this.isAdmin = this.currentUser.getRole().name == 'Admin';
    return this.currentUser.getUser().id == id || this.isAdmin
  }

  ionViewDidEnter(){
    let userId = this.navParams.get('id');
    let service: Observable<User>;
    if (this.isAdmin) {
      service = this.rest.getUserDetail(userId)
    } else {
      service = this.rest.getUserData(); // Current user

    }
    service.subscribe(
      response => {
        this.user = response;
        this.username = this.user.username;
        this.role = this.getRole(this.user);
        this.originalRol = this.role;
        this.profileImage = this.user.profile.profile_pic;
        if (this.profileImage != null && this.profileImage[0] == '/') {
          this.profileImage = this.rest.realurl + this.profileImage
        }
      }
    );
    this.rest.getCountries().subscribe(
      response => {
        this.countries = response;
      }
    )
  }

  getRole(user: User): String{
    if (user.groups != null && user.groups.length > 0){
      return user.groups[0].name
    }
    return 'Undefined'
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      this.rest.updateProfileImage(this.user.id, file).subscribe(
        (sucess: any) => this.profileImage = sucess.profile_pic
      )
    }
  }

  updateProfile(){
    this.disableButton = false;
    // Call API for non Admins (changes to current user profile)
    if (this.currentUser.getRole().name != 'Admin'){
      this.rest.updateCurrentUserData(this.user).finally( () => this.disableButton = true).subscribe( // enable button when update is finish
        sucess => this.showToast()
      );
      return;
    }

    // Call API for groups if role has changed (only Admin) and user data (Admin)
    if(this.originalRol != this.role && this.role != 'Undefined' && this.role != 'Pending'){ // enable button when update is finish
      Observable.forkJoin(
        this.rest.updateRole(this.user.id, this.role),
        this.rest.updateUserData(this.user).finally( () => this.disableButton = true)
      ).subscribe( success => this.showToast());
    } else {
      this.rest.updateUserData(this.user)
        .finally( () => this.disableButton = true)
        .subscribe( success=> this.showToast());
    }
  }

  showToast(){
    let toast = this.toastCtrl.create({
      message: 'Su perfil ha sido modificado correctamente',
      duration: 3000
    });
    toast.present();
  }
}
