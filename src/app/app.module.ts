import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { ListPage } from '../pages/list/list';
import { ChatPage } from '../pages/chat/chat';
import { SearchPage } from '../pages/search/search';
import { TabsPage } from '../pages/tabs/tabs';
import { CollegeDetailPage } from '../pages/college-detail/college-detail';
import { HomePage } from '../pages/home/home';
import { LogInPage } from '../pages/login-modal/login-modal';
import { SignupModal } from '../pages/signup-modal/signup-modal';
import { ProfilePage, HSPage } from '../pages/profile/profile';
import { SignUpPage } from '../pages/sign-up/sign-up';

import { IonicStorageModule } from '@ionic/storage'

import { Colleges } from '../providers/colleges';
import { Auth } from '../providers/auth';
import { Profile } from '../providers/profile';
import { Chat } from '../providers/chat';

import { AngularFireModule, AuthProviders, AuthMethods } from 'angularfire2';

// AF2
export const  firebaseConfig = {
  apiKey: "AIzaSyAlOEP2BRgnfWTCjm7ccBb686uUjJsI9T0",
  authDomain: "collegesearch-272e4.firebaseapp.com",
  databaseURL: "https://collegesearch-272e4.firebaseio.com",
  storageBucket: "collegesearch-272e4.appspot.com",
  messagingSenderId: "232604844315"
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Password,
  method: AuthMethods.Password
};

@NgModule({
  declarations: [
    MyApp,
    ListPage,
    ChatPage,
    SearchPage,
    TabsPage,
    CollegeDetailPage,
    HomePage,
    LogInPage,
    ProfilePage,
    SignUpPage,
    HSPage,
    SignupModal
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ListPage,
    ChatPage,
    SearchPage,
    TabsPage,
    CollegeDetailPage,
    HomePage,
    LogInPage,
    ProfilePage,
    SignUpPage,
    HSPage,
    SignupModal
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Colleges,
    Auth,
    Profile,
    Chat
  ]
})
export class AppModule {}
