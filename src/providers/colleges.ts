import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import firebase from 'firebase';

@Injectable()
export class Colleges {

  public collegesRef = firebase.database().ref('/colleges');
  public allData = [];

  constructor(public http: Http) {

  }

  getLocalCollegeData() {
    this.http.get('/assets/data/colleges.json')
      .map(res => res.json())
      .subscribe(data => {
        //console.log(data);
        this.allData = data;
      });
  }

  getCollege(id): Promise<any> {
    let collegeData: Object;
    return new Promise((resolve, reject) => {
      this.collegesRef.child(id).once('value', snapshot => {
        collegeData = snapshot.val();
        collegeData['unitid'] = snapshot.key;
        resolve(collegeData);
        return false;
      }, function(error) {
        console.error(error);
      });
      //resolve(collegeData);
    });
  }




}
