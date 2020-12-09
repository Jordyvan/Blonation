import { Component } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';
import {Router, RouterEvent} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  logged: any;
  userID: any;
  user: any;
  constructor(
      private auth: AuthService,
      private storage: Storage,
      private router: Router,
  ) {
    this.logged = false;
    this.router.events.subscribe((event: RouterEvent) => {
      this.getLogin();
      // console.log('test');
    });
  }

  ngOninit(){

  }

  ionViewWillEnter(){
    this.auth.userDetails().subscribe(res => {
      if (res !== null){
        console.log('uid:', res.uid);
        this.userID = res.uid;
      }
    }, err => {
      console.log(err);
    });
    this.getLogin();
  }

  async getLogin(){
    await this.storage.get('logged')
        .then( value => {
          if (value !== null){
            if (value === 1){
              this.logged = true;
            }
          }else if (value === null) {

            this.logged = false;
          }
          this.auth.getAll().snapshotChanges().pipe(
              map(changes =>
                  changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
          ).subscribe( data1 => {
            for (const us of data1){
              if (us.uid === this.userID){
                this.user = us;
              }
            }
          });
        });

  }

}
