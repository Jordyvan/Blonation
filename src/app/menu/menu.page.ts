import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent} from '@angular/router';
import {Storage} from '@ionic/storage';
import {NavController} from '@ionic/angular';
import {AuthService} from '../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  temp: any;
  activePath = '';
  logged: boolean;
  admin: boolean;

  pages: any;

  pagesNotLogin = [
    {
      name: 'Home',
      path: '/menu/home',
      icon: 'home'
    },
    {
      name: 'Schedule',
      path: '/menu/schedule',
      icon: 'calendar'
    },
    {
      name: 'Login',
      path: '/menu/login',
      icon: 'log-in'
    },
    {
      name: 'Register',
      path: '/menu/register',
      icon: 'pencil'
    },
  ];

  pagesUser = [
    {
      name: 'Home',
      path: '/menu/home',
      icon: 'home'
    },
    {
      name: 'Schedule',
      path: '/menu/schedule',
      icon: 'calendar'
    },
    {
      name: 'Profile',
      path: '/menu/profile',
      icon: 'person'
    },
  ];

  pagesAdmin = [
    {
      name: 'Home Admin',
      path: '/menu/home-admin',
      icon: 'home'
    },
    {
      name: 'Add event',
      path: '/menu/add-event',
      icon: 'calendar'
    },
    {
      name: 'Add location',
      path: '/menu/add-location',
      icon: 'location'
    },
  ];

  constructor(
      private router: Router,
      private storage: Storage,
      private nav: NavController,
      private auth: AuthService,
  ) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event !== null){
        this.activePath = event.url;
      }
      this.getLogin();
      // console.log('test');
    });

    this.auth.userDetails().subscribe(res => {
      if (res !== null){
        console.log('uid:', res.uid);
      }
    }, err => {
      console.log(err);
    });
  }

  ngOnInit(){
    // this.getLogin();
  }

  ionViewWillEnter(){
    this.getLogin();
  }

  async getLogin(){
    this.storage.get('logged')
        .then( value => {
      if (value !== null){
        if (value === 11){
          this.pages = this.pagesAdmin;
        }else {
          this.pages = this.pagesUser;
        }
        this.logged = true;
      }else if (value === null) {
        this.pages = this.pagesNotLogin;
        this.logged = false;
      }
    });

    // this.storage.get('admin').then( value1 => {
    //   if (value1 !== null){

    //   }
    // });
  }

  logout(){
    this.auth.logoutUser();
    console.log('Logout');
    this.storage.remove('logged');
    this.nav.navigateBack('/home');
  }

}
