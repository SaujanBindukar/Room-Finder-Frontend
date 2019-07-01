import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-add-info',
  templateUrl: 'add-info.html',
})
export class AddInfoPage {
  yourInfo = {
    typeOfRent : '',
    gender : '',
    food : '',
    smoking : '',
    drinking : '',
    cleanliness : ''
  };
  roomImage;
  err;
  room = {};

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private roomFinder: RoomFinderApiProvider,
    private alertCtrl: AlertController) {

  }

  ionViewCanEnter() {
    return new Promise((resolve, reject) => {
      this.roomFinder.getPersonalInfo().subscribe(data => {
        this.yourInfo = {
          typeOfRent : data.yourInfo.typeOfRent,
          gender : data.yourInfo.gender,
          food : data.yourInfo.food,
          smoking : data.yourInfo.smoking,
          drinking : data.yourInfo.drinking,
          cleanliness : data.yourInfo.cleanliness
        };
        resolve(true);
      }, err => {
        let alert = this.alertCtrl.create({
          title: 'Unknown Error',
          message: "Cannot get your personal info.....",
          buttons: ['OK']
        }).present();
        resolve(true);
      });
    });
  }

  update() {
    this.roomFinder.updatePersonalInfo(this.yourInfo).subscribe(data => {
      this.getInfo();
      let alert = this.alertCtrl.create({
        title: 'Successful',
        message: "Updated your personal Info",
        buttons: ['OK']
      }).present();
    }, err => {
      let alert = this.alertCtrl.create({
        title: 'Unknown Error',
        message: "Cannot update your personal info.....",
        buttons: ['OK']
      }).present();
    })
  }

  getInfo(){
    this.roomFinder.getPersonalInfo().subscribe(data => {
      this.yourInfo = data.yourInfo;
    }, err => {
      let alert = this.alertCtrl.create({
        title: 'Unknown Error',
        message: "Cannot get your personal info.....",
        buttons: ['OK']
      }).present();
    });
  }
}
