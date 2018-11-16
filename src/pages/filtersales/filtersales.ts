import { Component } from '@angular/core';
import { Events, IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-filtersales',
  templateUrl: 'filtersales.html',
})
export class FiltersalesPage {

  constructor(public viewCtrl: ViewController, public event: Events) {
  }

  filterApproved(){
    this.event.publish('filter:approved');
    this.viewCtrl.dismiss();
  }

  filterNotApproved(){
    this.event.publish('filter:notapproved');
    this.viewCtrl.dismiss();
  }

  showAll(){
    this.event.publish('filter:all');
    this.viewCtrl.dismiss();
  }

}
