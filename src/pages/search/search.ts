import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { RoomDetailsPage } from '../room-details/room-details';

@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchData = {
    searchParam: "",
    min: 500,
    max: 1000000
  };

  founded = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private roomFinder: RoomFinderApiProvider,
    private alertCtrl: AlertController) {
    this.searchData.searchParam = this.navParams.get('searchParam');
    this.founded = this.navParams.get('founded');
  }

  search(param) {
    if (this.searchData.searchParam != '') {
      this.roomFinder.search(param).subscribe(data => {
        console.log(data);
        this.founded = data;
      }, err => {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Cannot search at the moment',
          buttons: ['OK']
        });
        alert.present();
      })
    }
  }

  viewDetails(deal) {
    this.navCtrl.push(RoomDetailsPage, { deal })
  }

  async searchRoom() {
    console.log("Here");
    await this.search(this.searchData);
  }
}
