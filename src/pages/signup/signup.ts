import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Storage } from '@ionic/storage';
import { RoomFinderApiProvider } from '../../providers/room-finder-api/room-finder-api';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage implements OnInit {
  private signupForm: FormGroup;
  loginPage: any;

  constructor(public navCtrl: NavController,
    private storage: Storage,
    private roomFinder: RoomFinderApiProvider,
    private fb: FormBuilder,
    private alertCtrl: AlertController) {
    this.loginPage = LoginPage;
  }

  ngOnInit() {
    this.signupForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.pattern('(\\b[A-Z]{1}[a-z]+)( )([A-Z]{1}[a-z]+\\b)(( )([A-Z]{1}[a-z]+\\b))?')]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^9[7-8]{1}[0-9]{8}$')]],
      password: ['', [Validators.required, Validators.pattern('.{6,}')]],
      confirmPassword: ['', [Validators.required, Validators.pattern('.{6,}')]]
    });
  }

  save() {
    if (!this.signupForm.invalid) {
      if (this.signupForm.value.password == this.signupForm.value.confirmPassword) {
        this.roomFinder.createUser(this.signupForm.value).subscribe(
          data => {
            if (data.statusCode == 200 || data.statusCode == 201) {
              let alert = this.alertCtrl.create({
                title: 'Successful ',
                message: 'Account created successfully.',
                buttons: ['OK']
              }).present();
              this.navCtrl.push(LoginPage);
            } else if (data.statusCode == 409) {
              let alert = this.alertCtrl.create({
                title: 'Error',
                message: data.statusMessage,
                buttons: ['OK']
              }).present();
            } else {
              let alert = this.alertCtrl.create({
                title : 'Unknown Error',  
                message : data.statusCode,
                buttons : ['OK']
              }).present();
            }
          },
          err => {
            let alert = this.alertCtrl.create({
              title: 'Error',
              message: 'Something went wrong.',
              buttons: ['OK']
            });
            alert.present();
          }
        );
      } else {
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: 'Confirm Password is not equal..',
          buttons: ['OK']
        });
        alert.present();
      }
    } else {
      let alert = this.alertCtrl.create({
        title: "INVALID",
        message: "Please fill all the field correctly",
        buttons: ['OK']
      });
      alert.present();
    }
  }
}
