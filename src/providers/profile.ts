import { Injectable } from '@angular/core';

import { Auth } from '../providers/auth';
import firebase from 'firebase';

import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class Profile {

  public currentUser: Object;
  public profileRef: any;
  public listRef: any;
  public myList;

  constructor(
    public authService: Auth,
    public af: AngularFire
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.profileRef = firebase.database().ref('/users')
      .child(this.currentUser['uid']);
    this.listRef = firebase.database().ref('/users')
      .child(this.currentUser['uid']).child('myList');

    this.myList = this.getList();
  }

  inList(unitid): any {
    // if user is signed in, check if school is in /myList
    return this.listRef.child(unitid);
    // .on('value', snapshot => {
    //   console.log(snapshot.val());
    //   if (snapshot.exists()) return true;
    //   else return false;
    // });
    //return this.af.database.object(this.listRef.child(unitid).toString());

  }

  getList() {
    return this.af.database.list(this.listRef.toString())
      .map(items => items.sort((a, b) => a.list_order - b.list_order)) as FirebaseListObservable<any[]>;
  }

  addSchoolToList(collegeData) {
    //this.profileRef.child('myList').child(collegeData['unitid']).set(collegeData);
    let ref = this.listRef.child(collegeData['unitid']).toString();
    return this.af.database.object(ref).set(collegeData);
  }

  removeSchoolFromList(unitid) {
    //this.profileRef.child('myList').child(unitid).remove();
    let ref = this.listRef.child(unitid).toString();
    return this.af.database.object(ref).remove();
  }

}
