import { Component, ViewChild } from '@angular/core';

import { NavController, Content } from 'ionic-angular';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {

  @ViewChild(Content) content: Content;

  public scrollTime:any = 500;
  public writingTime:any = 1250;
  public waitTime:any = 1750;
  public chatList:Array<Object> = [];
  public messages:Array<Object> = [
    "Hello - it is nice to meet you.",
    "I'm am still working on this chat feature.",
    "While I do that, go ahead and try creating a balanced school list by searching for schools."
  ];

  constructor(public navCtrl: NavController) {

    this.messages.forEach((text,index,collection) => {
      setTimeout(() => {
        setTimeout(() => {
          if (index < this.messages.length - 1) this.chatList.push("...");
          this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, this.scrollTime);
        }, this.writingTime);
        setTimeout(() => {
          if (this.chatList[this.chatList.length - 1] === "...") this.chatList.pop();
          this.content.scrollTo(0, this.content.getContentDimensions().scrollHeight, this.scrollTime);
          this.chatList.push(this.messages[index]);
        }, this.scrollTime);
      }, index * this.waitTime);
    });

  }


}
