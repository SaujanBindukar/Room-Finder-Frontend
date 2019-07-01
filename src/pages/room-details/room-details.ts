import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { CallNumber } from '@ionic-native/call-number';
import { ChatRoomPage } from '../chat-room/chat-room';

@Component({
  selector: 'page-room-details',
  templateUrl: 'room-details.html',
})
export class RoomDetailsPage {
  isOwner: Boolean = false;
  deal;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private roomFinder: RoomFinderApiProvider,
    private call : CallNumber,
    private alertCtrl : AlertController) {
    this.deal = navParams.get('deal');
    this.isOwner = navParams.get('owner');
  }

  returnObjectWithTrue(obj) {
    var keys = Object.keys(obj);

    var filtered = keys.filter(function (key) {
      return obj[key]
    });
    return filtered;
  }

  contact(deal) {
      this.call.callNumber(String(deal.ownerPhone),true);
  }

  newChat(ownerId){
    this.roomFinder.newChat({
      ownerId
    }).subscribe( data => {
      this.navCtrl.push(ChatRoomPage, {
        conversationId : data.conversation._id,
        recipient : data.recipient
      });
    }, err => {
      let alert = this.alertCtrl.create({
        title : 'Error',
        message : 'Cannot make a new chat.',
        buttons : ['OK']
      });
      alert.present();
    })
  }

}
