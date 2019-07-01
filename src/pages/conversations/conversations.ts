import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { Storage } from '@ionic/storage';
import { ChatRoomPage } from '../chat-room/chat-room';
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-conversations',
  templateUrl: 'conversations.html',
})
export class ConversationsPage {
  userObject = null;
  conversations = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private roomFinder: RoomFinderApiProvider,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private call: CallNumber,
    private alertCtrl: AlertController) {
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();
      this.storage.get('userObject')
        .then(value => {
          this.userObject = value;
          this.roomFinder.getConversations().subscribe(data => {
            console.log(data);
            this.conversations = data.fullChats;
            if (data) {
              loading.dismiss();
              resolve(true);
            }
          }, err => {
            loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Error',
              message: 'Cannot find your conversations....',
              buttons: ['OK']
            });
            alert.present();
            reject(true);
          });
        })
        .catch(err => {
          let alert = this.alertCtrl.create({
            title: 'Error',
            message: 'Unknown User Error',
            buttons: ['OK']
          });
          alert.present();
          loading.dismiss();
          reject(true);
        });
    });
  }

  gotoChat(conversationId, recipient) {
    this.navCtrl.push(ChatRoomPage, {
      conversationId,
      recipient
    });
  }

  callPerson(phoneNumber) {
    this.call.callNumber(String(phoneNumber), true);
  }

  getAnotherPerson(chat) {
    let anotherUser;
    if (chat) {
      if (this.userObject._id == chat.recipient._id) {
        anotherUser = chat.author;
      } else {
        anotherUser = chat.recipient;
      }
      return anotherUser;
    } else {
      return false;
    }
  }
}
