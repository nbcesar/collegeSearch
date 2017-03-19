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
      hsName: [''],
      hsCode: ['']
    });

    this.profileForm.valueChanges
      .debounceTime(1000)
      // .subscribe(data => {
      //   this.profileService.updateProfile(data);
      // });
      .subscribe((data) => {
        this.profileChanged = true;
      });
  }

  ionViewDidLoad() {
    //this.myProfile = this.profileService.myProfile;
    this.profileService.myProfile
      .subscribe(subdata => {
        console.log('subscribe', subdata.$value);
        if (subdata.$value) {
          for (var control in subdata) {
            this.profileForm.controls[control].patchValue(subdata[control], {
              emitEvent: false
            });
          }
          this.saveProfile();
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
            <ion-option text-wrap value="AL">AL</ion-option>
            <ion-option text-wrap value="AK">AK</ion-option>
            <ion-option text-wrap value="AZ">AZ</ion-option>
            <ion-option text-wrap value="AR">AR</ion-option>
            <ion-option text-wrap value="CA">CA</ion-option>
            <ion-option text-wrap value="CO">CO</ion-option>
            <ion-option text-wrap value="CT">CT</ion-option>
            <ion-option text-wrap value="DE">DE</ion-option>
            <ion-option text-wrap value="FL">FL</ion-option>
            <ion-option text-wrap value="GA">GA</ion-option>
            <ion-option text-wrap value="HI">HI</ion-option>
            <ion-option text-wrap value="ID">ID</ion-option>
            <ion-option text-wrap value="IL">IL</ion-option>
            <ion-option text-wrap value="IN">IN</ion-option>
            <ion-option text-wrap value="IA">IA</ion-option>
            <ion-option text-wrap value="KS">KS</ion-option>
            <ion-option text-wrap value="KY">KY</ion-option>
            <ion-option text-wrap value="LA">LA</ion-option>
            <ion-option text-wrap value="ME">ME</ion-option>
            <ion-option text-wrap value="MD">MD</ion-option>
            <ion-option text-wrap value="MA">MA</ion-option>
            <ion-option text-wrap value="MI">MI</ion-option>
            <ion-option text-wrap value="MN">MN</ion-option>
            <ion-option text-wrap value="MS">MS</ion-option>
            <ion-option text-wrap value="MO">MO</ion-option>
            <ion-option text-wrap value="MT">MT</ion-option>
            <ion-option text-wrap value="NE">NE</ion-option>
            <ion-option text-wrap value="NV">NV</ion-option>
            <ion-option text-wrap value="NH">NH</ion-option>
            <ion-option text-wrap value="NJ">NJ</ion-option>
            <ion-option text-wrap value="NM">NM</ion-option>
            <ion-option text-wrap value="NY">NY</ion-option>
            <ion-option text-wrap value="NC">NC</ion-option>
            <ion-option text-wrap value="ND">ND</ion-option>
            <ion-option text-wrap value="OH">OH</ion-option>
            <ion-option text-wrap value="OK">OK</ion-option>
            <ion-option text-wrap value="OR">OR</ion-option>
            <ion-option text-wrap value="PA">PA</ion-option>
            <ion-option text-wrap value="RI">RI</ion-option>
            <ion-option text-wrap value="SC">SC</ion-option>
            <ion-option text-wrap value="SD">SD</ion-option>
            <ion-option text-wrap value="TN">TN</ion-option>
            <ion-option text-wrap value="TX">TX</ion-option>
            <ion-option text-wrap value="UT">UT</ion-option>
            <ion-option text-wrap value="VT">VT</ion-option>
            <ion-option text-wrap value="VA">VA</ion-option>
            <ion-option text-wrap value="WA">WA</ion-option>
            <ion-option text-wrap value="WV">WV</ion-option>
            <ion-option text-wrap value="WI">WI</ion-option>
            <ion-option text-wrap value="WY">WY</ion-option>
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
