import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Profile } from '../../providers/profile';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public myList;

  constructor(
    public navCtrl: NavController,
    public profileService: Profile,
  ) {}

  ionViewDidEnter() {
    this.myList = this.profileService.getList();
  }

  reorderItems(indexes) {
    console.log(indexes);
    this.myList.map(item => {
      console.log(item);
    }) as FirebaseListObservable<any[]>;
  }

}
