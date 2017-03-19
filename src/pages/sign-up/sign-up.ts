import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Slides, AlertController, LoadingController, ModalController, Content, TextInput, ToastController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';

import { ValidationService } from '../../validators/validators';
import { Auth } from '../../providers/auth';
import { Chat } from '../../providers/chat';

import { SignupModal } from '../signup-modal/signup-modal';

@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html'
})
export class SignUpPage {

  @ViewChild(Content) content: Content;
  @ViewChild(TextInput) input: TextInput;

  public chatData: any;

  public messagesList: any = [];
  public chatPosition: string = 'signin-1';

  // Find the right #s below
  // public writingTime = 100; // 1000
  // public waitingTime = 100; // 1500
  // public scrollTime = 100; // 500

  public writingTime = 1000;
  public waitingTime = 1250;
  public scrollTime = 500;

  public showButtonFooter: boolean = false;
  public buttonList: Array<Object> = [];
  public showInputFooter: boolean = false;
  public inputObj: Object;

  public firstName: string;
  public uid: string;

  public userData: Object = {};

  // @ViewChild(Slides) slides: Slides;
  //
  // public slideOneForm: any;
  // public slideTwoForm: any;
  // public slideThreeForm: any;
  // public slideFourForm: any;
  //
  // public gpaScale: string = '100';
  // public gpa100: Number = 85;
  // public gpa4: Number = 30;
  //
  // public test: string = 'SAT';
  // public satM: number = 500;
  // public satR: number =  500;
  // public actC: number = 20;
  //
  // public welcomeMessage = [
  //   `Welcome. Tell me a bit about yourself.`,
  //   `What is your GPA? If unsure, take your best guess for now.`,
  //   `Best test score?`,
  //   `These final details will let me give you personalized advice.`
  // ]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authService: Auth,
    public chatService: Chat,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
  ) {

      // this.slideOneForm = formBuilder.group({
      //   firstName: ['', Validators.compose([Validators.required])],
      //   email: ['', Validators.compose([Validators.required, ValidationService.emailValidator])],
      //   password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      //
      // });
      //
      // this.slideFourForm = formBuilder.group({
      //   state: ['', Validators.compose([Validators.required])],
      //   race: ['', Validators.compose([Validators.required])],
      //   familyIncome: ['', Validators.compose([Validators.required])],
      // });

      this.chatService.getChatData()
        .subscribe(data => {
          this.chatData = data;
          this.sendMessages(data['signin-1']);
        })

    }

  ionViewDidLoad() {
    // this.slides.lockSwipes(true);
    // this.chatData = this.chatService.getChatData()
    //   .subscribe(data => {
    //     console.log(data[this.chatPosition]);
    //     let messages = data[this.chatPosition].messages;
    //     messages.forEach((message, index) => {
    //       console.log(index);
    //       setTimeout(()=> {
    //         this.messagesList.push(message);
    //         console.log(this.messagesList);
    //       },this.waitingTime * (index));
    //
    //     });
    //     // Iterate over messages and send to messages list
    //   });
  }

  sendMessages(topic) {
    topic.messages.forEach((message, index) => {
      // Send each message
      setTimeout(() => {
        setTimeout(() => {
          this.messagesList.push({text: '...', from: 'MrCesar'});
          //this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, this.scrollTime);
          setTimeout(()=> {
            this.content.scrollToBottom(this.scrollTime);
          },100);
        }, this.scrollTime);
        setTimeout(() => {
          // Check if variable needs to be replace
          if (message.variables) {
            // Iterate over vairables and replace with local variable (for home chat page, will need access to profile info for this)
            message.variables.forEach((variable) => {
              let newText = message.text.replace(variable, this.userData[variable]);
              message.text = newText;
            });
          }
          this.messagesList[this.messagesList.length - 1].text = message.text;
          //this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, this.scrollTime);
          this.content.scrollToBottom(this.scrollTime);
          // If last message, check what is next
          if (index === topic.messages.length - 1) {
            // Check if there is a response
            if (topic.response) {
              // Check if buttons, then show
              if (topic.response.type === 'buttons') {
                this.showButtonFooter = true;
                this.content.resize();
                setTimeout(()=> {
                  this.content.scrollToBottom(this.scrollTime);
                },100);
                topic.response.buttons.forEach((button) => {
                  this.buttonList.push(button);
                });
              }
              // Check for input
              else if (topic.response.type === 'input') {
                this.showInputFooter = true;
                this.content.resize()
                setTimeout(()=> {
                  this.content.scrollToBottom(this.scrollTime);
                },100)
                this.inputObj = topic.response;
              }
              // Check for last message
              else if (topic.response.type == 'createUser') {
                this.createAccount();
              }
            }
          }
        }, this.writingTime);
      }, index * this.waitingTime);
    });


  }

  inputResponse() {
    // Get input value
    let responseValue = this.input.value;

    // Test if valid. If not, send toast
    if (responseValue == null || responseValue == "" || !responseValue.replace(/^\s+/g, '').length) {
      let toast = this.toastCtrl.create({
        message: "Something's wrong. Try again.",
        duration: 2000,
        position: 'top'
      });
      toast.present();
      return;
    }

    // Clear footer
    this.showInputFooter = false;
    this.content.resize();
    this.content.scrollToBottom(this.scrollTime);
    this.input.value = '';

    // Add response to messagesList
    this.messagesList.push({'text': responseValue, 'from': 'user'});

    // Save input to object if chat contains saveToProfile
    if (this.inputObj['saveToProfile']) {
      this.userData[this.inputObj['name']] = responseValue;
    }
    // Check what handler says to do next
    // If handler type == 'sendMessage' then sendMessages
    if (this.inputObj['handler']['type'] == 'sendMessage') {
      this.sendMessages(this.chatData[this.inputObj['handler']['goTo']]);
    }


  }

  buttonResponse(button) {
    // Check what handler says to do next
    // If handler type == 'sendMessage' then sendMessages
    if (button.handler.type == "sendMessage") {
      // Send button text to messagesList
      this.messagesList.push({'text': button.text, 'from': 'user'});

      // Clear button list and reset content area
      this.showButtonFooter = false;
      this.content.resize();
      this.content.scrollToBottom(this.scrollTime);
      this.buttonList = [];

      // If saveToProfile, save data to userData
      if (button.saveToProfile) {
        this.userData[button.name] = button.value;
      }
      // Go to next message
      this.sendMessages(this.chatData[button.handler.goTo]);
    }
    // If handler type == 'prompt' check what prompt and prompt
    if (button.handler.type == "prompt") {
      this.getUser(button.handler.prompt, button.handler.goTo);
    }
  }

  getUser(prompt, goTo) {
    let modal = this.modalCtrl.create(SignupModal, {'goTo': prompt});
    modal.onDidDismiss(data => {
      if (data) {
        // Clear button footer
        this.buttonList = [];
        this.showButtonFooter = false;
        this.content.resize();
        this.content.scrollToBottom(this.scrollTime);
        // Is there a message to return?
        if (data.userMessage) this.messagesList.push({'text': data.userMessage, 'from': 'user'});
        // If data contains uid, save locally
        if (data.toSaveName && data.toSaveValue) {
          this.userData[data.toSaveName] = data.toSaveValue;
        }
        if (data.toSaveName == 'email') {
          this.userData['password'] = data.password;
        }
        if (data.academics) {
          this.userData['academics'] = data.academics;
        }
        this.sendMessages(this.chatData[goTo]);
      }
    })
    modal.present();
  }

  createAccount() {
    // Start loading
    let loading = this.loadingCtrl.create({
      //content: 'Creating your account. Please wait...'
    });
    loading.present();

    this.authService.signUpUser(this.userData)
    .then(()=> {
      setTimeout(()=> {
        loading.dismiss();
      }, 1000);
    })
    .catch(error => {
      loading.dismiss();
        console.log(error);
        this.presentAlert("Ouch", error.message);
    });
  }

  signUpUser() {
    // Loading
    // let loading = this.loadingCtrl.create({
    //   //content: 'Creating your account. Please wait...'
    // });
    //
    // loading.present();
    // // Try to create a new account
    // this.authService.signUpUser({
    //   email: this.slideOneForm.value.email,
    //   firstName: this.slideOneForm.value.firstName,
    //   password: this.slideOneForm.value.password,
    //   gpaScale: this.gpaScale,
    //   gpa100: this.gpa100,
    //   gpa4: this.gpa4,
    //   test: this.test,
    //   satM: this.satM,
    //   satR: this.satR,
    //   actC: this.actC,
    //   state: this.slideFourForm.value.state,
    //   race: this.slideFourForm.value.race,
    //   familyIncome: this.slideFourForm.value.familyIncome
    // })
    // .then( () => {
    //   setTimeout(()=> {
    //     loading.dismiss();
    //   }, 1000);
    // })
    // // Sign up errors
    // .catch( (error:any) => {
    //   loading.dismiss();
    //   console.log(error);
    //
    //   this.presentAlert("Ouch", error.message);
    // });
    // // TODO: Add loading screen when creating an account before transitioning to main screen
  }

  // next() {
  //   // Get the active slide before moving on
  //   let activeSlide = this.slides.getActiveIndex();
  //
  //   //If on 1st slide - check slideOneForm before moving on
  //   if (activeSlide == 0) {
  //     if (this.slideOneForm.valid) {
  //       this.moveToNextSlide();
  //     }
  //     else {
  //       // Add alert to tell user to fix form
  //       this.presentAlert("Ouch", `Something's off. Make sure everything on this page is correct.`);
  //     }
  //   }
  //
  //   // Slides 2 & 3 can move on by default
  //   if (activeSlide == 1 || activeSlide == 2) {
  //     this.moveToNextSlide();
  //   }
  //
  //   // If on 4st slide - check slideOneForm before moving on
  //   if (activeSlide == 3) {
  //     if (this.slideFourForm.valid) {
  //       this.signUpUser();
  //     }
  //     else {
  //       // Add alert to tell user to fix form
  //       this.presentAlert("Ouch", `Somethin's missing. This info let's me provide really personalized advice. I won't share it with anyone without your permission. If you are not sure, take your best guess.`);
  //     }
  //   }
  //
  // }

  // prev() {
  //   // Get the active slide before moving on
  //   let activeSlide = this.slides.getActiveIndex();
  //
  //   if (activeSlide == 0) this.navCtrl.pop();
  //   else {
  //     this.slides.lockSwipes(false);
  //     this.slides.slidePrev();
  //     this.slides.lockSwipes(true);
  //   }
  //
  // }

  // moveToNextSlide() {
  //   this.slides.lockSwipes(false);
  //   this.slides.slideNext();
  //   this.slides.lockSwipes(true);
  // }

  presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['Got it']
    });
    alert.present();
  }

  // logInForm() {
  //   let modal = this.modalCtrl.create(LogInPage);
  //   modal.present();
  // }

}
