import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, LoadingController, AlertController } from 'ionic-angular';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { RoomDetailsPage } from '../room-details/room-details';
import { Storage } from '@ionic/storage';
import { LoginPage } from '../login/login';
import { AddInfoPage } from '../add-info/add-info';
import { ViewPostsPage } from '../view-posts/view-posts';
import { BackgroundMode } from '@ionic-native/background-mode';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  myPosts = null;
  profile;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private roomFinder: RoomFinderApiProvider,
    private menu: MenuController,
    private loadingCtrl: LoadingController,
    private storage: Storage,
    private alertCtrl: AlertController,
    private backgroundMode : BackgroundMode) {
    this.menu.toggle();
  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });

      loading.present();

      this.roomFinder.getUserProfile().subscribe(data => {
        this.myPosts = data.rooms;
        this.profile = data.user;

        loading.dismiss();
        if (data) {
          resolve(true);
        }
      }, err => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Something went wrong...fetching your profile',
          buttons: ['OK']
        });
        alert.present();
        reject(true);
      });

    });
  }

  viewPosts() {
    this.navCtrl.push(ViewPostsPage);
  }

  personalDetails() {
    this.navCtrl.push(AddInfoPage);
  }

  logout() {
    this.storage.set('token', 'logedout').then(data => { //delete token when logged out
      console.log(data);
      this.menu.enable(false);
      this.navCtrl.setRoot(LoginPage);
    }).catch( err => {
      let alert = this.alertCtrl.create({
        title : 'Error',
        message : 'Cannot get your user object',
        buttons : ['OK']
      });
      alert.present();
    });
  }
}
