import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Events, Content, TextInput } from 'ionic-angular';
import { RestProvider } from "../../providers/rest/rest";
import { AuthProvider } from "../../providers/auth/auth";
import { UserdataProvider } from "../../providers/userdata/userdata";
import { Message } from "../../models/message";
import { User } from "../../models/user";

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage {

  @ViewChild('content') content: Content;
  @ViewChild('chat_input') messageInput: TextInput;
  msgList: Message[] = [];
  user: User;
  userImage: string;
  toUserName: User;
  toUserImage: string;
  editorMsg = '';
  showEmojiPicker = false;
  roomId: number;

  private updateTask: any;
  private updateInterval = 10000; // Look for new messages every 10 seconds (change this if u need faster lookup)

  constructor(public navParams: NavParams,
              private rest: RestProvider,
              private auth: AuthProvider,
              private currentUser: UserdataProvider,
              private events: Events,
              public navCtrl: NavController,
              public toastCtrl: ToastController) {
  }

  ionViewCanEnter(){
    if (!this.navParams.get('toUserImage') == null || this.navParams.get('toUserName') == null){
      return false
    }
    return this.auth.isAuthenticated()
  }

  ionViewWillLeave() {
    // unsubscribe
    this.events.publish('chat:enable');      // Enable chat floating button
    clearInterval(this.updateTask)
  }

  ionViewDidEnter() {
    // Get the navParams toUserId parameter
    this.roomId = this.navParams.get('roomId');
    this.toUserImage = this.navParams.get('toUserImage');
    this.toUserName = this.navParams.get('toUserName');

    this.events.publish('chat:disable');    // Enable chat floating floating button
    this.user = this.currentUser.getUser(); // Get current user info
    this.userImage = this.rest.realurl + this.user.profile.profile_pic;
    if (this.user.profile.profile_pic == null){
      this.userImage = 'assets/imgs/defaultuser.png';
    }

    // Room already created
    if (this.roomId != null){
      this.getMsg();    //get message list
      this.setUpUpdateTask();
    }
  }

  //Search for new messages every this.updateinterval
  setUpUpdateTask(){
    this.updateTask = setInterval(()=> {
      this.updateNewMsg();
    }, this.updateInterval)
  }

  onFocus() {
    this.content.resize();
    this.scrollToBottom();
  }

  private updateNewMsg(){
    this.rest.getUnreadMessages(this.roomId).subscribe(
      sucess => {
        let newMsgs = sucess.results.sort((a,b)=> a - b);
        for (let i in newMsgs){
          this.pushNewMsg(newMsgs[i])
        }
      }
    )
  }

  private getMsg() {
    this.rest.getAllMessages(this.roomId).subscribe(
      res => {
        this.msgList = res.results.sort((a, b) => a.id - b.id); // Get latest msg first
        this.scrollToBottom();
      }
    );
    this.rest.getUnreadMessages(this.roomId).subscribe(); // Get unread message to show latest messages are read
  }

  sendMsg() {
    if (!this.editorMsg.trim()) return;

    // No room created (first time chat)
    if (this.roomId == null){
      let toUserId = this.navParams.get('toUserId'); // Only First time chat
      this.rest.createRoom(toUserId).subscribe(
        success => {
          this.roomId = success.id;
          this.setUpUpdateTask();
          this.rest.sendMessage(this.roomId, this.editorMsg).subscribe(
            success => {
              this.pushNewMsg(success); // push message if sucessful sent message to web service
              this.editorMsg = '';
            }
          );
        },
        fail => {
          let detail: string = fail.error.detail;
          let errorMsg: string;
          if (detail == null){
            errorMsg = 'Error del servidor intente mas tarde'
          } else if (detail.startsWith('Room')) {
            errorMsg = 'Ya existe un chat con este usuario'
          }
          let toast = this.toastCtrl.create({
            message: errorMsg,
            duration: 3000
          });
          toast.present();
          this.navCtrl.setRoot('ChatListPage')
        }
      )
      // Room is created before
    } else {
      this.rest.sendMessage(this.roomId, this.editorMsg).subscribe(
        success => {
          this.pushNewMsg(success); // push message if sucessful sent message to web service
          this.editorMsg = '';
        }
      );
    }
  }

  pushNewMsg(msg: Message) {
    this.msgList.push(msg);
    this.scrollToBottom();
  }

  // getMsgIndexById(id: string) {
  //   return this.msgList.findIndex(e => e.messageId === id)
  // }

  scrollToBottom() {
    setTimeout(() => {
      try {
        this.content.scrollToBottom();
      } catch (e){
        console.log(e)
      }
    }, 400)
  }
}
