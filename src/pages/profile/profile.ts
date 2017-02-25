import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Auth } from '../../providers/auth';
import { Profile } from '../../providers/profile';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public myProfile;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: Auth,
    public profileService: Profile
  ) {}

  ionViewDidLoad() {
    this.myProfile = this.profileService.myProfile;
  }

  logout() {
    this.authService.logout();
  }

}
