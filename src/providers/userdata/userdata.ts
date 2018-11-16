import { Injectable } from '@angular/core';
import { User } from "../../models/user";
import { Role } from "../../models/role";

/**
 * Provider to store current userdata
 */
@Injectable()
export class UserdataProvider {

  private user: User;

  constructor() {
  }

  setUser(user: User){
    this.user = user;
  }

  getUser(){
    return this.user;
  }

  getRole(): Role{
    let role: Role = { name: '' };
    if (this.user && this.user.groups.length > 0) {
      role = this.user.groups[0]
    }
    return role
  }

  clear(){
    this.user = null;
  }
}

