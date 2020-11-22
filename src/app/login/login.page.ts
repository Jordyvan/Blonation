import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {NavController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validationForm: FormGroup;
  errorMessage: string = '';
  validationMessages = {
    'email': [
      { type: 'required', message: 'Email is required.'},
      { type: 'pattern', message: 'Enter a valid email.'}
    ],
    'password': [
      { type: 'required', message: 'Password is required.'},
      { type: 'minlength', message: 'Password must be at least 5 characters long.'}
    ]
  };

  constructor(private nav: NavController,
              private auth: AuthService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.validationForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ]))
    });
  }

  loginUser(value) {
    this.auth.loginUser(value).then(
        res => {
          console.log(res);
          this.errorMessage = '';
          this.nav.navigateForward('/profile');
        }, err => {
          console.log(err);
          this.errorMessage = err.message;
        });
  }

  goToRegisterPage(){
    this.nav.navigateForward('/register');
  }

}
