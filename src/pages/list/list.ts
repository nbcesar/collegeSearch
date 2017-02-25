import { Component } from '@angular/core';
import { NavController, FabContainer } from 'ionic-angular';

import { CollegeDetailPage } from '../college-detail/college-detail';

import { Profile } from '../../providers/profile';
import { Colleges } from '../../providers/colleges';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  public myList;
  public reOrder: Boolean = false;

  constructor(
    public navCtrl: NavController,
    public profileService: Profile,
    public collegeService: Colleges,
  ) {}

  ionViewDidLoad() {
    this.myList = this.profileService.myList;
  }

  ionViewWillLeave() {
    this.reOrder = false;
  }

  toggleReorder(fab: FabContainer) {
    fab.close();
    this.reOrder = !this.reOrder;
  }

  reorderItems(indexes) {
    //console.log(indexes);
    this.profileService.reOrderItems(indexes);
    // this.myList.subscribe(item => {
    //   console.log('reorder', item);
    // });
  }

  goToCollege(id) {
    this.collegeService.getCollege(id)
    .then(collegeData => {
      this.navCtrl.push(CollegeDetailPage, {
        collegeData: collegeData
      });
    });
  }


}
