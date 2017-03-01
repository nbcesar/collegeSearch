import { Component, ViewChild, NgZone } from '@angular/core';
import { Platform, App, Nav } from 'ionic-angular';

import { TabsPage } from '../pages/tabs/tabs';
import { ChatPage } from '../pages/chat/chat';
import { HomePage } from '../pages/home/home';

import { AngularFire } from 'angularfire2';

import firebase from 'firebase';

// Testing
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav;

  rootPage: any;

  constructor(
    platform: Platform,
    app: App,
    private zone: NgZone,
    public af: AngularFire
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
    });
    const authObserver = af.auth.subscribe( user => {
      if (user) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = HomePage;
      }
    });
  }

}
