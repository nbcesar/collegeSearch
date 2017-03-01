import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Auth } from '../providers/auth';

import firebase from 'firebase';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Injectable()
export class Profile {

  public currentUser: Object;
  public profileRef: any;
  public listRef: any;

  public myList;
  public myProfile;

  constructor(
    public authService: Auth,
    public af: AngularFire,
    public storage: Storage
  ) {
    this.currentUser = this.authService.getCurrentUser();
    this.profileRef = firebase.database().ref('/users').child(this.currentUser['uid']).child('profile');
    this.listRef = firebase.database().ref('/users').child(this.currentUser['uid']).child('myList');

    this.myList = this.getList();
    this.myProfile = this.getProfile();
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

  getProfile() {
    return this.af.database.object(this.profileRef.toString());
  }

  reOrderItems(indexes) {
    let from = indexes.from;
    let to = indexes.to;
    let moveDown: Boolean;
    if (from < to) moveDown = true;
    else moveDown = false;
    this.listRef.once('value', list => {
      list.forEach(school => {
        let order = school.val().list_order;
        if (order == from) school.ref.child('list_order').set(to);
        else if (order == to && moveDown) school.ref.child('list_order').set(to - 1);
        else if (order == to && !moveDown) school.ref.child('list_order').set(to + 1);
        else if (order > from && order < to) school.ref.child('list_order').set(order - 1);
        else if (order > to && order < from) school.ref.child('list_order').set(order + 1);
      });
    });
  }

  updateOrder(unitid, newIndex) {
    return this.af.database.list(this.listRef.toString())
      .update(unitid, {list_order: newIndex});
  }

  addSchoolToList(collegeData) {
    // Get length of list
    return this.listRef.once('value', list => {
      let listLength = list.numChildren();
      collegeData['list_order'] = listLength;
      let ref = this.listRef.child(collegeData['unitid']).toString();
      this.af.database.object(ref).set(collegeData);
    });

    //return this.af.database.object(ref).set(collegeData);
  }

  removeSchoolFromList(unitid) {
    let ref = this.listRef.child(unitid).toString();
    return this.af.database.object(ref).remove();
  }

  updateProfile(profile) {
    this.myProfile.set(profile);
  }
  updateHS(newSchool, oldSchoolCode) {
    // Remove student from old /highSchools
    firebase.database().ref('highSchools').child(oldSchoolCode).child(this.currentUser['uid']).remove();
    // Add user to new /highSchools
    firebase.database().ref('highSchools').child(newSchool.code).child(this.currentUser['uid']).set(true);
    // Update user/profile/highSchool name
    this.myProfile.update({highSchool:
      {
        name: newSchool.name,
        code: newSchool.code
      }
    });
  }

}
