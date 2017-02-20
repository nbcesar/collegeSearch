import { Component, ViewChild,  } from '@angular/core';
import { NavController, NavParams, Slides,
         ModalController, Platform, ViewController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl }          from '@angular/forms';

import { SignUpPage } from '../sign-up/sign-up';

import { Auth } from '../../providers/auth';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild(Slides) slides: Slides;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: Auth,
    public modalCtrl: ModalController
  ) {}

  ionViewDidLoad() {

  }

  signUpForm() {
    this.navCtrl.push(SignUpPage);
  }

  logInForm() {
    let modal = this.modalCtrl.create(LogInPage);
    modal.present();
  }

}

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Sign in
        </ion-title>
        <ion-buttons left>
          <button ion-button (click)="dismiss()">
            <ion-icon name="md-close"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <h1 class="test">Welcome Back</h1>
      <form [formGroup]="loginForm" (submit)="loginUser()" novalidate>
        <ion-item>
          <ion-label stacked>Email</ion-label>
          <ion-input formControlName="email" type="email" placeholder="Email"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label stacked>Password</ion-label>
          <ion-input formControlName="password" type="password" placeholder="Password"></ion-input>
        </ion-item>
        <button ion-button block type="submit" color="dark" [disabled]="!loginForm.valid">Login</button>
      </form>
    </ion-content>
  `
})
export class LogInPage {

  public loginForm: any;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public authService: Auth,
    public formBuilder: FormBuilder
  ) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  loginUser() {

    let email = this.loginForm.value.email;
    let password = this.loginForm.value.password;
    this.authService.login(email, password);
    this.dismiss();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
