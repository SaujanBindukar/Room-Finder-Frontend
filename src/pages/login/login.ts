import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, MenuController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { Storage } from '@ionic/storage';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

  SignUp = SignupPage;
  Home = HomePage;
  private loginForm: FormGroup;


  constructor(private roomFinder: RoomFinderApiProvider,
    private storage: Storage,
    private navCtrl: NavController,
    private menu: MenuController,
    private fb: FormBuilder,
    private alertCtrl : AlertController) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      phone: ['', [Validators.required, Validators.maxLength(10), Validators.pattern('^9[7-8]{1}[0-9]{8}$')]],
      password: ['', [Validators.required]]
    });
  }

  userLogin() {
    if (!this.loginForm.invalid) {
      this.roomFinder.login(this.loginForm.value).subscribe(
        data => { //if suceessfull just connection ok
          if (data.statusCode == 200 || data.statusCode == 201) { // auth must be okay upto this point
            this.storage.set('token', data.token);
            this.storage.set('userObject', data.userObject);
            this.navCtrl.setRoot(this.Home);
            this.menu.enable(true);
          }
          else if (data.statusCode == 409) {
            let alert = this.alertCtrl.create({
              title : 'Error',
              message : data.statusMessage,
              buttons : ['OK']
            });
            alert.present();
          } else {
            let alert = this.alertCtrl.create({
              title : 'Unknown Error',  
              message : data.statusCode,
              buttons : ['OK']
            });
            alert.present();
          }
        },
        err => { //if error must be connection error
          let alert = this.alertCtrl.create({
            title : 'Error',
            message : 'Connection Error....Please connect to the Internet',
            buttons : ['OK']
          });
          alert.present();
        }
      );
    } else {
      let alert = this.alertCtrl.create({
        title : 'Error',
        message : 'Invalid fields....',
        buttons : ['OK']
      });
      alert.present();
    }
  }
}
