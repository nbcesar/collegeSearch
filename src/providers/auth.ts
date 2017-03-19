import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import { AngularFire } from 'angularfire2';
import firebase from 'firebase';

@Injectable()
export class Auth {

  public usersRef = firebase.database().ref('/users');
  public connected: Boolean; // TODO: Figure out how to make this an observable and subscribe to it
  fireAuth: any;

  constructor(public af: AngularFire, public http: Http) {
    af.auth.subscribe( user => {
      if (user) {
        this.fireAuth = user.auth;
      }
    });

    var connectedRef = firebase.database().ref(".info/connected");
    connectedRef.on("value", snap => {
      if (snap.val() === true) {
        this.connected = true;
      } else {
        this.connected = false;
      }
      //console.log(this.connected);
    });

  }

  getCurrentUser() {
    return firebase.auth().currentUser;
  }

  logout(): any {
    return this.af.auth.logout();
    //firebase.auth().signOut();
  }

  login(email: string, pw: string): any {
    return this.af.auth.login({email: email, password: pw});
    // firebase.auth().signInWithEmailAndPassword(email, pw).catch((error) => {
    //   console.log(error);
    // });
  }

  checkUser(email) {
    return firebase.auth().fetchProvidersForEmail(email);
  }

  signUpUser(userData) {
    return this.af.auth.createUser({email: userData.email, password: userData.password})
      // After creating user, create profile for user
      .then( newUser => {
        console.log(newUser.uid);
        // If user selected SAT, delete ACT data
        if (userData.academics.test == 'SAT') userData.academics.actC = '';
        // If user selected ACT, delete SAT data
        else if (userData.academics.test == 'ACT') { userData.academics.satM = ''; userData.academics.satR = '';}
        // If no test selected, clear score data
        else if (userData.academics.test == '') {
          userData.academics.actC = ''; userData.academics.satM = ''; userData.academics.satR = '';
        }

        // Whatever GPA scale user selected, make a .gpa property
        if (userData.academics.gpaScale == "100") userData.academics.gpa = userData.academics.gpa100;
        else if (userData.academics.gpaScale == '') userData.academics.gpa = '';
        else userData.academics.gpa = userData.academics.gpa4 / 10;
        delete userData.academics['gpa100'];
        delete userData.academics['gpa4'];

        this.usersRef.child(newUser.uid).child('profile').set({
          email: userData.email,
          firstName: userData.firstName,
          gpaScale: userData.academics.gpaScale,
          gpa: userData.academics.gpa,
          test: userData.academics.test,
          satM: userData.academics.satM,
          satR: userData.academics.satR,
          actC: userData.academics.actC,
          race: userData.race,
        });

      }) // .then
      .then( (newUser) => {
        //this.calculateOdds(userData, newUser);
      })
      .catch( (error: any) => {
        console.log(error);
      });

  }

  // Call to microservice that will calculate odds for all schools.
  calculateOdds(userData, newUser) {
    console.log(userData);
    console.log(newUser);
    this.http.post('https://us-central1-college-search-160414.cloudfunctions.net/newUser  ', {userData: userData, newUser: newUser})
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      });
  };

  // Test function for GCloud Functions
  testGCloud(message) {
    this.http.post('https://us-central1-college-search-160414.cloudfunctions.net/helloHttp', {message: message})
      .map(res => res.json())
      .subscribe(data => {
        console.log(data);
      });
  }

}
