import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../model/user';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.scss'],
})
export class ProfileEditPage implements OnInit {
  validationForm: FormGroup;
  errorMessage: string;
  email: any = [];
  newU: User;

  userID: any;
  user: any;
  tempUser: any;

  validationMessages = {
    email: [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Enter a valid email.'}
    ],
    password: [
      { type: 'required', message: 'Password is required.'},
      { type: 'minlength', message: 'Password must be at least 5 characters long.'}
    ],
    name: [
      { type: 'required', message: 'Name is required.'},
    ],
    address: [
      { type: 'required', message: 'Address is required.'},
    ],
    phone: [
      { type: 'required', message: 'Phone is required.'},
    ]
  };

  constructor(
      private nav: NavController,
      private auth: AuthService,
      private formBuilder: FormBuilder,
      private loading: LoadingController,
      private storage: Storage,
      private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.errorMessage = '';

    // ambil uid
    this.auth.userUid().subscribe(res => {
      if (res !== null){
        this.userID = res.uid;
      }
    }, err => {
      console.log(err);
    });

    this.auth.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data1 => {
      this.user = data1;
      for (const us of this.user){
        if (us.uid === this.userID){
          this.tempUser = [].concat(us);
          console.log(this.tempUser);

          this.validationForm = this.formBuilder.group({
            name: new FormControl(this.tempUser[0].nameFull, Validators.compose([
              Validators.required
            ])),
            email: new FormControl(this.tempUser[0].email, Validators.compose([
              Validators.required
            ])),
            address: new FormControl(this.tempUser[0].address, Validators.compose([
              Validators.required
            ])),
            phone : new FormControl(this.tempUser[0].phone, Validators.compose([
              Validators.required
            ])),
            weight : new FormControl(this.tempUser[0].weight, Validators.compose([
              Validators.required
            ])),
            height : new FormControl(this.tempUser[0].height, Validators.compose([
              Validators.required
            ])),

          });
        }
      }
    });
  }

  tryRegister(value){
    console.log(value);
    this.tempUser[0].nameFull = value.name;
    this.tempUser[0].address = value.address;
    this.tempUser[0].phone = value.phone;
    this.tempUser[0].height = value.height;
    this.tempUser[0].weight = value.weight;
    console.log(this.tempUser);
    this.auth.update(this.tempUser[0].key, this.tempUser[0]);
    this.presentToast();
    this.nav.navigateForward('/menu/profile');

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Profile has been Updated',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }

}
