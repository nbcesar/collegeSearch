import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/Rx';

import firebase from 'firebase';

@Injectable()
export class Colleges {

  public collegesRef = firebase.database().ref('/colleges');
  public allData = [];
  public allHS = [];

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

  getHS(state: string, query: string) {
    return this.http.post('https://college-search-api.herokuapp.com/hs', {'state': state, 'query': query})
      .map(res => res.json())
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
