import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { ImagePicker } from '@ionic-native/image-picker';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'page-add-room',
  templateUrl: 'add-room.html',
})
export class AddRoomPage implements OnInit {
  private addRoomForm: FormGroup;
  facilities = ['Separate Kitchen', 'Attached Bathroom', 'Drinking Water', 'Dining Room'];

  roomImage: Array<String> = [];
  err;
  room = {};

  constructor(public navCtrl: NavController,
    private camera: Camera,
    private roomFinder: RoomFinderApiProvider,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private imagePicker: ImagePicker,
    private socket: Socket,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.addRoomForm = this.fb.group({
      typeOfRent: ['', [Validators.required]],
      numberOfRoom: [1, [Validators.required, Validators.max(30)]],
      facilitiesAvailable: this.fb.group({
        'Separate Kitchen': [false],
        'Attached Bathroom': [false],
        'Drinking Water': [false],
        'Dining Room': [false]
      }),
      additionalFeatures: [''],
      price: [1000, [Validators.required]],
      location: ['', [Validators.required]]
    });
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 40,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    }

    this.camera.getPicture(options).then((imageData) => {
      let imgData = 'data:image/jpeg;base64,' + imageData;
      this.roomImage.push(imgData);
    }, (err) => {
      // Handle error
    });
  }

  selectFromGallery() {
    let options = {
      quality: 40,
      outputType: 1
    }
    this.imagePicker.getPictures(options)
      .then(images => {
        images.forEach(image => {
          let imgData = 'data:image/jpeg;base64,' + image;
          this.roomImage.push(imgData);
        });
      })
      .catch(err => {
        console.log(err);
      })
  }

  addRoom() {
    if (!this.addRoomForm.invalid) {
      this.room = this.addRoomForm.value;
      this.room['RoomImage'] = this.roomImage;

      let loading = this.loadingCtrl.create({
        content: 'Adding Room Please wait...'
      });

      loading.present();
      this.roomFinder.addRoom(this.room).subscribe(res => {
        if (res.statusCode == 200) {
          this.roomFinder.sendNotifications(res.roomData).subscribe(
            data => {
              this.socket.emit('roomAdded', {});
              loading.dismiss();
              this.navCtrl.setRoot(HomePage);
            }, err => {
              loading.dismiss();
              this.navCtrl.setRoot(HomePage);
            }
          )
        }
        else {
          loading.dismiss();
          this.err = "Please fill all the fields along with image";
          let alert = this.alertCtrl.create({
            title: "Cannot Add Room Now....",
            message: this.err,
            buttons: ['OK']
          });
          alert.present();
        }
      }, err => {
        loading.dismiss();
        this.err = "Something wrong going on with server";

        let alert = this.alertCtrl.create({
          title: "Cannot Add Room Now....",
          message: this.err,
          buttons: ['OK']
        });
        alert.present();
      });
    } else {
      console.log('INVALID');
    }
  }

}
