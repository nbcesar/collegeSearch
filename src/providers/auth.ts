import { Injectable } from '@angular/core';

import { AngularFire } from 'angularfire2';
import firebase from 'firebase';

@Injectable()
export class Auth {

  public usersRef = firebase.database().ref('/users');
  fireAuth: any;

  constructor(public af: AngularFire) {
    af.auth.subscribe( user => {
      if (user) {
        this.fireAuth = user.auth;
      }
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

  signUpUser(userData) {
    return this.af.auth.createUser({email: userData.email, password: userData.password})
      .then( newUser => {
        this.usersRef.child(newUser.uid).child('profile').set({
          firstName: userData.firstName,
          gpaScale: userData.gpaScale,
          gpa100: userData.gpa100,
          gpa4: userData.gpa4,
          test: userData.test,
          satM: userData.satM,
          satR: userData.satR,
          actC: userData.actC,
          state: userData.state,
          race: userData.race,
          familyIncome: userData.familyIncome
        });
      })
      .catch( (error: any) => {
        console.log(error);
      });
    /*console.log(userData);
    firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
      .then(newUser => {
        this.usersRef.child(newUser.uid).child('profile').set({
          firstName: userData.firstName,
          gpaScale: userData.gpaScale,
          gpa100: userData.gpa100,
          gpa4: userData.gpa4,
          test: userData.test,
          satM: userData.satM,
          satR: userData.satR,
          actC: userData.actC,
          state: userData.state,
          race: userData.race,
          familyIncome: userData.familyIncome
        });
      })
      .catch((error: any) => {
        console.log(error);
        console.log(error.code);
      });*/
  }

}
