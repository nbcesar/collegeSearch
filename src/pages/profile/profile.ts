import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Searchbar } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';

import { Auth } from '../../providers/auth';
import { Profile } from '../../providers/profile';
import { Colleges } from '../../providers/colleges';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {

  public myProfile;
  public profileChanged: Boolean = false;

  public profileForm: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: Auth,
    public profileService: Profile,
    public formBuilder: FormBuilder,
    public modalCtrl: ModalController
  ) {
    this.profileForm = formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      state: [''],
      graduation: [''],
      counselor: [''],
      gpaScale: [''],
      gpa: '',
      test: [''],
      actC: [''],
      satM: [''],
      satR: [''],
      race: [''],
      familyIncome: [''],
      gender: [''],
      dob: [''],
      hsName: [{value:'', disabled: true}],
      hsCode: ['']
    });

    this.profileForm.valueChanges
      .debounceTime(1000)
      // .subscribe(data => {
      //   this.profileService.updateProfile(data);
      // });
      .subscribe(() => {
        this.profileChanged = true;
      });
  }

  ionViewDidLoad() {
    //this.myProfile = this.profileService.myProfile;
    this.profileService.myProfile
      .subscribe(subdata => {
        //console.log('subscribe', subdata);
        for (var control in subdata) {
          // If updating highSchool, pull name of hs out of profile
          if (control == 'highSchool') {
            this.profileForm.controls['hsName'].patchValue(subdata[control].name, {
              emitEvent: false
            });
            this.profileForm.controls['hsCode'].patchValue(subdata[control].code, {
              emitEvent: false
            });
            continue;
          }
          this.profileForm.controls[control].patchValue(subdata[control], {
            emitEvent: false
          });
        }
        this.profileChanged = false;
      });
  }

  logout() {
    this.authService.logout();
  }

  saveProfile() {
    this.profileService.updateProfile(this.profileForm.value);
    this.profileChanged = false;
  }

  changeHS() {
    let hsModal = this.modalCtrl.create(HSPage, {state: this.profileForm.controls['state'].value});
    hsModal.onDidDismiss(school => {
      // If school and different than current hs, update profile with new high school
      if (school && this.profileForm.controls['hsCode'].value != school.code) {
        this.profileService.updateHS(school, this.profileForm.controls['hsCode'].value);
      }
    });
    hsModal.present();
  }
}

/*
 *
 *  High School search modal
 *
*/

@Component({
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Find your high school.
        </ion-title>
        <ion-buttons left>
          <button ion-button (click)="dismiss()">
            <ion-icon name="md-close"></ion-icon>
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
    <ion-list>
      <ion-item>
        <p>Select the state and then start typing your school name.</p>
      </ion-item>
      <ion-item>
        <ion-label>State</ion-label>
        <ion-select [(ngModel)]="state">
            <ion-option value="AL">AL</ion-option>
            <ion-option value="AK">AK</ion-option>
            <ion-option value="AZ">AZ</ion-option>
            <ion-option value="AR">AR</ion-option>
            <ion-option value="CA">CA</ion-option>
            <ion-option value="CO">CO</ion-option>
            <ion-option value="CT">CT</ion-option>
            <ion-option value="DE">DE</ion-option>
            <ion-option value="FL">FL</ion-option>
            <ion-option value="GA">GA</ion-option>
            <ion-option value="HI">HI</ion-option>
            <ion-option value="ID">ID</ion-option>
            <ion-option value="IL">IL</ion-option>
            <ion-option value="IN">IN</ion-option>
            <ion-option value="IA">IA</ion-option>
            <ion-option value="KS">KS</ion-option>
            <ion-option value="KY">KY</ion-option>
            <ion-option value="LA">LA</ion-option>
            <ion-option value="ME">ME</ion-option>
            <ion-option value="MD">MD</ion-option>
            <ion-option value="MA">MA</ion-option>
            <ion-option value="MI">MI</ion-option>
            <ion-option value="MN">MN</ion-option>
            <ion-option value="MS">MS</ion-option>
            <ion-option value="MO">MO</ion-option>
            <ion-option value="MT">MT</ion-option>
            <ion-option value="NE">NE</ion-option>
            <ion-option value="NV">NV</ion-option>
            <ion-option value="NH">NH</ion-option>
            <ion-option value="NJ">NJ</ion-option>
            <ion-option value="NM">NM</ion-option>
            <ion-option value="NY">NY</ion-option>
            <ion-option value="NC">NC</ion-option>
            <ion-option value="ND">ND</ion-option>
            <ion-option value="OH">OH</ion-option>
            <ion-option value="OK">OK</ion-option>
            <ion-option value="OR">OR</ion-option>
            <ion-option value="PA">PA</ion-option>
            <ion-option value="RI">RI</ion-option>
            <ion-option value="SC">SC</ion-option>
            <ion-option value="SD">SD</ion-option>
            <ion-option value="TN">TN</ion-option>
            <ion-option value="TX">TX</ion-option>
            <ion-option value="UT">UT</ion-option>
            <ion-option value="VT">VT</ion-option>
            <ion-option value="VA">VA</ion-option>
            <ion-option value="WA">WA</ion-option>
            <ion-option value="WV">WV</ion-option>
            <ion-option value="WI">WI</ion-option>
            <ion-option value="WY">WY</ion-option>
          </ion-select>
      </ion-item>
      <ion-item *ngIf="state">
        <ion-searchbar (ionInput)="getSchools($event)" (ionClear)="clearSearch()" ></ion-searchbar>
      </ion-item>
      <ion-item *ngFor="let school of filteredSchools" (click)="addHS(school)">
        <h2>{{ school.name }}</h2>
        <p> {{ school.city }}
      </ion-item>
    </ion-list>


    </ion-content>
  `
})
export class HSPage {

  @ViewChild(Searchbar) searchEl: Searchbar;

  public state: string;
  public schoolName: string;
  public filteredSchools: any[];

  constructor(
    public params: NavParams,
    public viewCtrl: ViewController,
    public authService: Auth,
    public collegesService: Colleges,
  ) {
    this.state = params.get('state');
  }

  clearSearch() {
    this.filteredSchools = [];
  }

  getSchools(searchbar) {
    let query:any = this.searchEl.value;
    if (query.length < 4) {
      this.filteredSchools = [];
      return;
    }
    this.collegesService.getHS(this.state, query)
      .subscribe(data => {
        this.filteredSchools = data.results;
      });
  }

  addHS(school) {
    this.viewCtrl.dismiss(school);
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
