import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-book-room',
  templateUrl: 'book-room.html',
})
export class BookRoomPage {

    price = 0;
    constructor(public navCtrl: NavController) {
    }

    onInput(){
      console.log('Inputed');
    }

    onClick(){
      console.log(this.price);
    }


    ionViewDidLoad() {
    console.log('ionViewDidLoad BookRoomPage');
  }

}


