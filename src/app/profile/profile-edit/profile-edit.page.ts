import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../model/user';
import {LoadingController, NavController} from '@ionic/angular';
import {AuthService} from '../../services/auth.service';
import {Storage} from '@ionic/storage';

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
  ) { }

  ngOnInit() {
    this.errorMessage = '';
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      address: new FormControl('', Validators.compose([
        Validators.required
      ])),
      phone : new FormControl('', Validators.compose([
        Validators.required
      ])),
      blood : new FormControl('', Validators.compose([
        Validators.required
      ])),
      birth : new FormControl('2020', Validators.compose([
        Validators.required
      ])),
      weight : new FormControl('', Validators.compose([
        Validators.required
      ])),
      height : new FormControl('', Validators.compose([
        Validators.required
      ])),

    });
  }

  tryRegister(value){
    this.auth.registerUser(value).then( // register Authentication
        res => {
          this.errorMessage = '';
          this.auth.userUid().subscribe(resa => { // realtime database
            if (resa !== null){
              // console.log('uid: ', resa.uid);
              this.newU = {
                uid: resa.uid,
                nameFull: value.name,
                email: value.email,
                bloodtype: value.blood,
                birthdate: value.birth,
                address: value.address,
                phone: value.phone,
                height: value.height,
                weight: value.weight,
                lastDonateDate: '',
                donated: 'false',
              };
              this.auth.create(this.newU);
              this.storage.set('logged', 1);
              this.nav.navigateForward('/menu/home');
            }
          });
        }, err => {
          console.log(err);
          this.errorMessage = err.message;

        }
    );

  }

}
