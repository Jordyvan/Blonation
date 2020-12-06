import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userEmail: string;
  userID: string;
  user: any;
  tempUser: any;
  constructor(
      private nav: NavController,
      private auth: AuthService,
      private storage: Storage,
  ) { }

  ngOnInit() {
    this.storage.get('logged').then( value => {
      if (value === null){
        this.nav.navigateBack('/home');
      }
    });


    this.auth.userUid().subscribe(res => {
      if (res !== null){
        this.userEmail = res.email;
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
      console.log(this.user);
      for (const us of this.user){
        if (us.uid === this.userID){
          this.tempUser = [].concat(us);

        }
      }
      console.log(this.tempUser);
    });
  }

  logout(){
    this.auth.logoutUser().then( res => {
      console.log('res: ', res);
      this.storage.remove('logged');
      this.nav.navigateBack('/home');
    }).catch(error => {
      console.log(error);
    });
  }

}
