import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage";

@Injectable()
export class AuthProvider {

  private token;

  constructor(public storage: Storage) {
    this.storage.get('user_token').then(value =>
      this.token = value
    );
  }

  isAuthenticated(): Promise<boolean>{
    return this.storage.get('user_token').then(
      value => {
        if (value) {
          this.token = value;
          return true
        } else {
          return false
        }
      }
    );
  }

  setToken(token: string){
    this.storage.set('user_token', 'Token ' + token); // Store user token
    this.token = 'Token ' + token;
  }

  getToken(): string{
    return this.token
  }

  logout(){
    this.storage.remove('user_token');
  }
}
