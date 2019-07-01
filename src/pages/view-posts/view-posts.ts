import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { RoomDetailsPage } from '../room-details/room-details';

@Component({
  selector: 'page-view-posts',
  templateUrl: 'view-posts.html',
})
export class ViewPostsPage {

  myPosts = [];
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private roomFinder: RoomFinderApiProvider,
    private loadingCtrl : LoadingController,
    private alertCtrl : AlertController) {
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      this.roomFinder.getRoomsPosts().subscribe(data => {
        this.myPosts = data.rooms;
        loading.dismiss();
        if (data) {
          resolve(true);
        }
      }, err => {
        let alert = this.alertCtrl.create({
          title : 'Error',
          message : 'Cannot Get Your Rooms....Try Again',
          buttons : ['OK']
        });
        alert.present();
        reject(true);
      });

    });
  }

  viewDetails(deal) {
    this.navCtrl.push(RoomDetailsPage, {
      owner: true,
      deal
    });
  }

  deleteRoom(deal) {
    this.roomFinder.deleteRoom(deal._id).subscribe(data => {
      this.roomFinder.getUserProfile().subscribe(data => {
        this.myPosts = data.rooms;
      }, err => {
        let alert = this.alertCtrl.create({
          title : 'Error',
          message : 'Cannot Delete Your Room.....Try Again',
          buttons : ['OK']
        });
        alert.present();
      });
    },
      err => { console.log(err) });
  }
}
