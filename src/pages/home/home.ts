import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from '../../validators/validators';

import { SignUpPage } from '../sign-up/sign-up';
import { LogInPage } from '../login-modal/login-modal';

import { Auth } from '../../providers/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public welcome_text: string = `Hi. I'm Mr. Cesar.`;
  public welcome_messages = [];
  public message_count = 0;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: Auth,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {
    this.welcome_messages = [
      `The Digital College Counselor`,
      `Let's get started.`,
    ];

    // setTimeout(() => {
    //   this.welcome_text = ``;
    // }, 3000);
    // setTimeout(() => {
    //   this.welcome_text = this.welcome_messages[0];
    // }, 5000);
    // setTimeout(() => {
    //   this.welcome_text = ``;
    // }, 8000);
    // setTimeout(() => {
    //   this.welcome_text = this.welcome_messages[1];
    // }, 10000);
  }

  signUpForm() {
    this.navCtrl.push(SignUpPage);
  }

  logInForm() {
    let modal = this.modalCtrl.create(LogInPage);
    modal.present();
  }

}
