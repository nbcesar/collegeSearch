import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Auth } from '../../providers/auth';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: Auth
  ) {}

  ionViewDidLoad() {
  }

  logout() {
    this.authService.logout();
  }

}
