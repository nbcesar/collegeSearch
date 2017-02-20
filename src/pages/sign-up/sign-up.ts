import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides } from 'ionic-angular';
import { FormBuilder, Validators, FormControl } from '@angular/forms';

import { Auth } from '../../providers/auth';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {

  @ViewChild(Slides) slides: Slides;

  public slideOneForm: any;
  public slideTwoForm: any;
  public slideThreeForm: any;
  public slideFourForm: any;

  public gpaScale: string = '100';
  public gpa100: Number = 85;
  public gpa4: Number = 30;
  public test: string = 'SAT';
  public satM: number = 500;
  public satR: number =  500;
  public actC: number = 20;

  public welcomeMessage = [
    `Welcome. Tell me a bit about yourself.`,
    `What is your GPA? If unsure, take your best guess for now.`,
    `Best test score?`,
    `These final details will let me give you personalized advice.`
  ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: Auth,
    public formBuilder: FormBuilder
  ) {



      this.slideOneForm = formBuilder.group({
        firstName: ['', Validators.compose([Validators.required])],
        email: ['', Validators.compose([Validators.required])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])],

      });

      this.slideFourForm = formBuilder.group({
        state: ['', Validators.compose([Validators.required])],
        race: ['', Validators.compose([Validators.required])],
        familyIncome: ['', Validators.compose([Validators.required])],
      });

    }

  ionViewDidLoad() {

    this.slides.lockSwipes(true);
  }

  signUpUser() {

    // Validate form

    this.authService.signUpUser({
      email: this.slideOneForm.value.email,
      firstName: this.slideOneForm.value.firstName,
      password: this.slideOneForm.value.password,
      gpaScale: this.gpaScale,
      gpa100: this.gpa100,
      gpa4: this.gpa4,
      test: this.test,
      satM: this.satM,
      satR: this.satR,
      actC: this.actC,
      state: this.slideFourForm.value.state,
      race: this.slideFourForm.value.race,
      familyIncome: this.slideFourForm.value.familyIncome
    });
  }

  next() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  prev() {
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

}
