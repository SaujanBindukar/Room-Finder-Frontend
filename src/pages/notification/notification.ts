import { Component , ViewChild } from '@angular/core';
import { NavController, NavParams, Content , AlertController } from 'ionic-angular';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { RoomDetailsPage } from '../room-details/room-details';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  @ViewChild(Content) content : Content;

  notifications = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private roomFinder: RoomFinderApiProvider,
    private alertCtrl : AlertController,
    private socket : Socket) {
      this.socket.on('roomAddedNotification', (data) => {
        this.getNotifications();
      })
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      this.roomFinder.getNotifications().subscribe(
        data => {
          this.notifications = data.notifications;
          resolve(true);
        },
        err => {
          let alert = this.alertCtrl.create({
            title : 'Error',
            message : 'Cannot get your Notifications',
            buttons : ['OK']
          });
          alert.present();
          reject(true);
        }
      )
    })
  }

  viewNotification(notification) {
    this.roomFinder.viewNotification(notification).subscribe(
      data => {
        if (notification.type == "room") {
          this.navCtrl.push(RoomDetailsPage, { deal: data.room });
        }
      }, err => {
        let alert = this.alertCtrl.create({
          title : 'Error',
          message : 'Something Went Wrong....might be the post have been deleted',
          buttons : ['OK']
        });
        alert.present();
      }
    )
  }

  getNotifications(){
    this.roomFinder.getNotifications().subscribe(
      data => {
        this.notifications = data.notifications;
        this.gotoBottom();
      },
      err => {
        let alert = this.alertCtrl.create({
          title : 'Error',
          message : 'Cannot get your Notifications',
          buttons : ['OK']
        });
        alert.present();
      });
  }

  gotoBottom(){
    setTimeout( () => {
      if(this.content._scroll){
        this.content.scrollToBottom();
      }
    }, 500);
  }

}
