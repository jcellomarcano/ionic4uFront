import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { Authentication } from "../../models/authentication";
import { User } from "../../models/user";
import { AuthProvider } from "../auth/auth";
import { Product } from "../../models/product";
import { Result } from "../../models/result";
import { Sale } from "../../models/sale";
import { Register } from "../../models/register";
import { Country } from "../../models/country";
import { Role } from "../../models/role";
import { Credit } from "../../models/credit";
import 'rxjs/add/operator/map'
import { Message } from "../../models/message";
import { Room } from "../../models/room";
import { Currency } from "../../models/currency";
import { Transfer } from "../../models/transfer";
import { Client } from "../../models/client";

@Injectable()
export class RestProvider {

  //////////////////////////// SET VARIABLE DEBUG to TRUE if Debugging on test server //////////////////////////////////
  public urlBase;
  public realurl;
  public debug = true;  // set to TRUE if debugging

  constructor(public http: HttpClient, public auth: AuthProvider) {
    this.realurl = 'http://www.4u.life';
    this.urlBase = 'http://www.4u.life/backend/';

    if (this.debug) {
      this.realurl = 'http://127.0.0.1:8000';
      this.urlBase = 'debug/'; // Uncomment this for debug mode using ionic serve
    }
  }

  //Get current user data
  getUserData(): Observable<User>{
    let url = this.urlBase + 'users/current/';
    //console.log("token is", this.auth.getToken());
    return this.http.get<User>(url, {
        headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateUserData(userData: User): Observable<User> {
    let url = this.urlBase + `users/${userData.id}/`;
    return this.http.put<User>(url, userData, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateCurrentUserData(userData: User): Observable<User>{
    let url = this.urlBase + `users/profile/update/${userData.id}/`;
    return this.http.put<User>(url, userData, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateProfileImage(userId: number, file: File){
    let url = this.urlBase + `users/picture/update/${userId}/`
    let formData:FormData = new FormData();
    formData.append('profile_pic', file, file.name);
    formData.append('user', userId.toString());
    return this.http.put(url, formData, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateRole(userId: number, roleName: String) {
    let role = roleName.toLowerCase();
    let url = this.urlBase + `groups/${role}/add/${userId}/`;
    return this.http.put<User>(url, {}, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getVendorsList(): Observable<Result>{
    let url = this.urlBase + `groups/vendor/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getUserRole(): Observable<Role>{
    return this.getUserData().map(
      response => {
        let role: Role = { name: '' };
        if (response.groups.length > 0) {
          role = response.groups[0]
        }
        return role
      }
    )
  }

  getUserList(): Observable<Result>{
    let url = this.urlBase + `users/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getUserDetail(userId: number): Observable<User>{
    let url = this.urlBase + `users/${userId}/`;
    return this.http.get<User>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getPrices(productId: number): Observable<Result>{
    let url = this.urlBase + `products/${productId}/prices/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  addPrice(productId: number, country: number, currency: number, price: number): Observable<any>{
    let url = this.urlBase + `products/${productId}/prices/add/`;
    return this.http.post(url, {price: price, country: country, currency: currency}, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updatePrice(productId: number, priceId: number, country: number, currency: number, price: number): Observable<any>{
    let url = this.urlBase + `products/${productId}/prices/${priceId}/update/`;
    return this.http.put(url, {price: price, country: country, currency: currency}, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  deletePrice(productId: number, priceId: number): Observable<any>{
    let url = this.urlBase + `products/${productId}/prices/${priceId}/remove/`;
    return this.http.delete(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getProducts(): Observable<Result>{
    let url = this.urlBase + 'products/';
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getProductsByCountry(country_code: string): Observable<Result>{
    let url = this.urlBase + `products/?search=${country_code}`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  addProduct(product: Product): Observable<any>{
    let url = this.urlBase + 'products/create/';
    return this.http.post(url, product, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateProduct(product: Product): Observable<any>{
    let url = this.urlBase + `products/${product.id}/`;
    return this.http.put(url, product, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  deleteProduct(productId: number): Observable<any>{
    let url = this.urlBase + `products/${productId}/`;
    return this.http.delete(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getProductDetail(productId: number): Observable<Product>{
    let url = this.urlBase + `products/${productId}/`;
    return this.http.get<Product>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  registerSale(vendorId: number, sale: Sale): Observable<any>{
    let url = this.urlBase + `vendors/${vendorId}/sales/create/`;
    return this.http.post(url, sale, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateSaleVoucher(saleId: number, file: File){
    let url = this.urlBase + `sales/${saleId}/photo/`;
    let formData:FormData = new FormData();
    formData.append('photo', file, file.name);
    return this.http.put(url, formData, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  registerSaleExternal(vendorId: number, sale: Sale): Observable<any>{
    let url = this.urlBase + `vendors/${vendorId}/sales/external/create/`;
    return this.http.post(url, sale, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateExternalSaleVoucher(saleId: number, file: File){
    let url = this.urlBase + `sales/external/${saleId}/photo/`;
    let formData:FormData = new FormData();
    formData.append('photo', file, file.name);
    return this.http.put(url, formData, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateSaleTracking(saleId: number, comment: string, file: File): Observable<any>{
    let url = this.urlBase + `dispatchers/sales/${saleId}/update/`;
    let formData:FormData = new FormData();
    formData.append('photo', file, file.name);
    formData.append('dispatch_comment', comment);
    return this.http.put(url, formData, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    })
  }

  getCountries(): Observable<Country[]>{
    let url = this.urlBase + `countries/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    }).map(response => response.results);
  }

  getCurrencies(): Observable<Currency[]>{
    let url = this.urlBase + `currencies/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    }).map(response => response.results);
  }

  getVendorCredit(vendorId: number): Observable<Credit[]>{
    let url = this.urlBase + `vendors/${vendorId}/credits/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    }).map(response => response.results);
  }

  getCreditDetail(vendorId: number, creditId: number): Observable<Credit>{
    let url = this.urlBase + `vendors/${vendorId}/credits/${creditId}/`;
    return this.http.get<Credit>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    })
  }

  updateVendorCredit(vendorId: number, creditId: number, currency: number, credit: number): Observable<any> {
    let url = this.urlBase + `vendors/${vendorId}/credits/${creditId}/`
    return this.http.put(url, {'credit': credit, currency: currency }, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getSaleList(vendorId: number): Observable<Result>{
    let url = this.urlBase + `vendors/${vendorId}/sales/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getAllSales(): Observable<Result>{
    let url = this.urlBase + `sales/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getExternalSaleList(vendorId: number): Observable<Result>{
    let url = this.urlBase + `vendors/${vendorId}/sales/external/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getExternalSaleDetails(saleId: number): Observable<Sale> {
    let url = this.urlBase + `sales/external/${saleId}/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }


  getAllExternalSales(): Observable<Result>{
    let url = this.urlBase + `sales/external/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getSaleDetails(saleId: number): Observable<Sale> {
    let url = this.urlBase + `sales/${saleId}/`;
    return this.http.get<any>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  approveSale(saleId: number, comment: string): Observable<any>{
    let url = this.urlBase + `sales/${saleId}/approve/`;
    return this.http.put(url, {'sale_comment': comment}, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  approveExternalSale(saleId: number, comment: string): Observable<any>{
    let url = this.urlBase + `sales/external/${saleId}/approve/`;
    return this.http.put(url, {'sale_comment': comment}, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getPendingDispatch(): Observable<Result>{
    let url = this.urlBase + `dispatchers/sales/pending/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  authentication(user: string, pass: string): Observable<any> {
    let url: string = this.urlBase + 'auth/login/';
    let auth: Authentication = {
      username: user,
      password: pass
    };
    return this.http.post(url, auth);
  }

  register(registerData: Register): Observable<any> {
    let url: string = this.urlBase + 'auth/registration/';
    return this.http.post(url, registerData);
  }

  forgotPassword(email: string): Observable<any>{
    let url: string = this.urlBase + 'auth/password/reset/';
    return this.http.post(url, {'email': email});
  }

  confirmReset(token: string, uid: string, pass1: string, pass2: string){
    let url: string = this.urlBase + 'auth/password/reset/confirm/';
    return this.http.post(url, {
      'token': token,
      'uid': uid,
      'new_password1': pass1,
      'new_password2': pass2}
    );
  }

  confirmEmail(token: string, user: string): Observable<any>{
    let url: string = this.urlBase + 'auth/registration/verify/';
    return this.http.post(url, {
      'token': token,
      'user': user
    });
  }

  getScoresByCountry(countryId: number): Observable<Result>{
    let url: string = this.urlBase + `scores/${countryId}/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  searchUser(search: string): Observable<Result>{
    let url: string = this.urlBase + `users/?search=${search}`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  createRoom(vendor2: number):  Observable<Room>{
    let url = this.urlBase + `messaging/rooms/create/`;
    return this.http.post<Room>(url, {vendor2: vendor2}, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getChatRooms(): Observable<Result>{
    let url: string = this.urlBase + `messaging/rooms/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  sendMessage(roomId: number, msg: string): Observable<Message>{
    let url = this.urlBase + `messaging/rooms/${roomId}/messages/send/`;
    return this.http.post<Message>(url, {message: msg}, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getAllMessages(roomId: number): Observable<Result>{
    let url: string = this.urlBase + `messaging/rooms/${roomId}/messages/all/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getUnreadMessages(roomId: number): Observable<Result>{
    let url: string = this.urlBase + `messaging/rooms/${roomId}/messages/unread/`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  sendTransfer(user1: number, user2: number, currency: number, amount: number):  Observable<Transfer>{
    let url = this.urlBase + `vendors/${user1}/transfers/send/`;
    return this.http.post<Transfer>(url,
      {
        user2: user2,
        currency: currency,
        amount: amount
      },
      {headers: new HttpHeaders().set('Authorization', this.auth.getToken())
      });
  }

  searchClient(search: string): Observable<Result> {
    let url: string = this.urlBase + `clients/?search=${search}`;
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  addClient(client: string, phone: string, country: number, address: string): Observable<Client>{
    let url = this.urlBase + `clients/create/`;
    return this.http.post<Client>(url,
      {
        client: client,
        phone: phone,
        country: country,
        address: address
      },
      {headers: new HttpHeaders().set('Authorization', this.auth.getToken())
      }
    );
  }

  getClient(clientID: number): Observable<Client>{
    let url: string = this.urlBase + `clients/${clientID}/`;
    return this.http.get<Client>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  updateClient(clientID: number, client: string, phone: string, country: number, address: string): Observable<Client>{
    let url = this.urlBase + `clients/${clientID}/`;
    return this.http.put<Client>(url,
      {
        client: client,
        phone: phone,
        country: country,
        address: address
      },
      {headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  deleteClient(clientID: number): Observable<any>{
    let url = this.urlBase + `clients/${clientID}/`;
    return this.http.delete(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  getNextPage(url: string){
    return this.http.get<Result>(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  deleteSale(id: number){
    let url = this.urlBase + `sales/${id}/remove/`;
    return this.http.delete(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }

  deleteExternalSale(id: number){
    let url = this.urlBase + `sales/external/${id}/remove/`;
    return this.http.delete(url, {
      headers: new HttpHeaders().set('Authorization', this.auth.getToken())
    });
  }
}
