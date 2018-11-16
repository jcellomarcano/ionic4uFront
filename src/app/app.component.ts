import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { RestProvider } from "../providers/rest/rest";
import { AuthProvider } from "../providers/auth/auth";
import { User } from "../models/user";
import { UserdataProvider } from "../providers/userdata/userdata";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav; // Enable navigation with this variable
  rootPage: any = 'LoginPage';
  public user: User;
  public profileImage: string;
  public credit: number;
  public chatButton: boolean = false;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public auth: AuthProvider, public rest: RestProvider, public menuCtrl: MenuController, public events: Events, public userData: UserdataProvider, private toastCtrl: ToastController) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.menuCtrl.enable(false);
      this.auth.isAuthenticated().then(
        isAuth => {
          if (isAuth) {
            this.openFirstPage();
          } else {
            this.rootPage = 'LoginPage';
          }
        }
      );
      // Subscribe event user:update to update userdata from other pages
      this.events.subscribe('user:login', () => {
        this.openFirstPage();
      });
      this.events.subscribe('user:update_credit', () => {
        this.updateCredit();
      });
      this.events.subscribe('chat:enable', () => {
        this.chatButton = true;
      });
      this.events.subscribe('chat:disable', () => {
        this.chatButton = false;
      })
    });

  }

  private updateUserData(data: User){
    this.user = data;
    this.credit = null;
    this.profileImage = 'assets/imgs/defaultuser.png';
    if (this.user.profile.profile_pic != null) {
      this.profileImage = this.rest.realurl + this.user.profile.profile_pic;
    }
    this.userData.setUser(data);
    // If is a new user
    if (this.userData.getRole().name == '') {
      let toast = this.toastCtrl.create({
        message: 'Su registro debe ser validado por un administrador',
        duration: 3000
      });
      toast.present();
      return;
    }
    this.updateCredit();
  }

  private updateCredit(){
    this.rest.getVendorCredit(this.user.id).subscribe(
      data => {
        for (let i in data) {
          if (data[i].currency_code == "USD") {
            this.credit = data[i].credit
            // TODO: Revisar ya que ahora solo esta en USD
          }
        }
      }
    );
  }

  private openFirstPage() {
    this.user = null;
    this.rest.getUserData().subscribe(
      data => {
        this.updateUserData(data)
        // Select which page will open
        if (this.userData.getRole().name == 'Dispatch'){
          this.nav.setRoot('DispatchlistPage')
        } else {
          this.nav.setRoot('SalelistPage');
        }
        this.menuCtrl.enable(true);
        this.chatButton = true;
      },
      error => {},
    );
  }

  // Open page by the name (string)
  openPage(page: String) {
    this.nav.setRoot(page, {}, {animate: true})
  }

  openPageParams(page: String, params: any){
    this.nav.setRoot(page, params, {animate: true})
  }

  pushPage(page: String){
    this.nav.push(page, {}, {animate: true})
  }

  changeProfile() {
    this.nav.setRoot('UserDetailsPage', {id: this.user.id}, {animate: true})
  }

  logout() {
    this.auth.logout();
    this.chatButton = false;
    this.userData.clear();
    this.menuCtrl.enable(false);
    this.nav.setRoot('LoginPage', {}, {animate: true});
  }
}

