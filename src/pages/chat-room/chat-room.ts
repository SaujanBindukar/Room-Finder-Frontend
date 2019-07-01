import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content, AlertController } from 'ionic-angular';
import { Socket } from 'ng-socket-io';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-chat-room',
  templateUrl: 'chat-room.html',
})
export class ChatRoomPage {
  @ViewChild(Content) content : Content;

  recipient = '' ;
  userObject = null ;
  conversations = null;

  body = {
    conversationId : '',
    message: '',
    recipient : ''
  }

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public socket: Socket,
    private roomFinder: RoomFinderApiProvider,
    private storage : Storage,
    private alertCtrl : AlertController) {
    this.body.conversationId = this.navParams.data.conversationId;
    this.body.recipient = this.navParams.data.recipient._id;
    this.recipient = this.navParams.data.recipient;
    this.socket.connect();
    this.socket.on('sentMessageSaved', (data) => {
      this.refreshConservation();
    })
    this.gotoBottom();
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      this.storage.get('userObject')
        .then( userObject => {
          this.userObject = userObject;
          this.roomFinder.getConversation(this.body.conversationId).subscribe( //remember array is already sorted
            data => {
              this.conversations = data.data;
              resolve(true);
            },
            err => {
              let alert = this.alertCtrl.create({
                title : 'Error',
                message : 'Cannot find your conversations....',
                buttons : ['OK']
              });
              alert.present();
              reject(true);
            }
          );
        })
        .catch( err => {
          reject(true);
          console.log(err)
        });  
    });
  }

  sendMessage(){
    this.roomFinder.sendReply(this.body).subscribe(
      data => {
        this.body.message = '';
        this.socket.emit('sentMessage',{});
        this.content.scrollToBottom();
      },
      err => {
        console.log(err);
      }
    );
  }

  refreshConservation(){
    this.roomFinder.getConversation(this.body.conversationId).subscribe(
      data => {
        this.conversations = data.data;
        this.gotoBottom();
      },
      err => {
        this.conversations = ['Some Error'];
      }
    );
  }

  gotoBottom(){
    setTimeout( () => {
      if(this.content._scroll){
        this.content.scrollToBottom();
      }
    }, 500);
  }

}
