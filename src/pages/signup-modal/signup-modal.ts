import { Component } from '@angular/core';

import { NavController, NavParams, ModalController, Platform, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { ValidationService } from '../../validators/validators';

import { Auth } from '../../providers/auth';

@Component({
  selector: 'page-signup-modal',
  templateUrl: 'signup-modal.html'
})
export class SignupModal {

  public signupForm: any;
  public prompt: string;

  public academics: Object = {
    gpaScale: '100',
    gpa100: 85,
    gpa4: 30,
    test: 'SAT',
    satM: 500,
    satR: 500,
    actC: 20
  }

  public screen: string = 'gpa';
  // public gpaScale: string = '100';
  // public gpa100: number = 85;
  // public gpa4: number = 30;
  //
  // public test: string = 'SAT';
  // public satM: number = 500;
  // public satR: number =  500;
  // public actC: number = 20;

  constructor(
    public platform: Platform,
    public params: NavParams,
    public viewCtrl: ViewController,
    public authService: Auth,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {

    this.prompt = params.get('goTo');

    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });

  }

  getEmail() {
    // Check for form Validation
    if (!this.signupForm.valid) {
      this.presentAlert('Ouch', `Something's wrong. Check what you typed.`);
      return;
    }
    // Loading
    let loading = this.loadingCtrl.create({
      //content: 'Creating your account. Please wait...'
    });

    loading.present();

    // // Try to create a new account
    // this.authService.signUpUser({
    //   email: this.signupForm.value.email,
    //   password: this.signupForm.value.password,
    // })
    // .catch(error => {
    //   loading.dismiss().then(()=> {
    //     this.presentAlert("Ouch", error.message);
    //   });
    // })
    // .then((user) => {
    //   if (user) {
    //     loading.dismiss().then(() => {
    //       this.viewCtrl.dismiss({status:'success',toSaveName: 'uid', toSaveValue: user.uid, userMessage: user.email });
    //     });
    //   }
    // });

    // Check if email exists
    this.authService.checkUser(this.signupForm.value.email)
    .then(data => {
      if (data.length == 0) {
        loading.dismiss().then(()=> {
          this.viewCtrl.dismiss({status:'success',toSaveName: 'email', toSaveValue: this.signupForm.value.email, userMessage: this.signupForm.value.email, email: this.signupForm.value.email, password: this.signupForm.value.password  });
        });
      }
      else {
        loading.dismiss().then(()=> {
          this.presentAlert("Ouch", 'That email is already taken. Cancel this and log back in or try a different email.');
        });
      }

    })
    .catch(error => {
      loading.dismiss().then(()=> {
        this.presentAlert("Ouch", error.message);
      });
    });

    // // Check for form Validation
    // if (!this.signupForm.valid) {
    //   this.presentAlert('Ouch', `Something's wrong. Check what you typed.`);
    //   return;
    // }
    // // Start loading screen
    // let loading = this.loadingCtrl.create({
    //   //content: 'Creating your account. Please wait...'
    // });
    // loading.present();
    //
    // let email = this.signupForm.value.email;
    // let password = this.signupForm.value.password;
    // this.authService.login(email, password)
    // .then( () => {
    //   setTimeout(()=> {
    //     this.dismiss();
    //     loading.dismiss();
    //   }, 1000);
    // })
    // .catch(error => {
    //   loading.dismiss();
    //   console.log(error);
    //   this.presentAlert("Ouch", `Something's wrong. I can't find your account. Try again.`);
    // });
    // //this.dismiss();
  }

  goToTest() {
    this.screen = 'testing';
  }

  goToGPA() {
    this.screen = 'gpa';
  }

  submitAcademics() {
    this.viewCtrl.dismiss({status:'success', userMessage: 'Got it', academics: this.academics });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Got it']
    });
    alert.present();
  }

}
