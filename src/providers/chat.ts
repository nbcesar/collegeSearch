import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class Chat {

  public chatData: any;

  constructor(public http: Http) {
    //this.getChatData();
  }

  getChatData(): any {
    return this.http.get('/assets/data/chat.json')
      .map(res => res.json())
      // .subscribe(data => {
      //   this.chatData = data;
      // });
  }

}
