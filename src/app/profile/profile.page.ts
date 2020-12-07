import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {NavController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {map} from 'rxjs/operators';
import {LoactionSrvcService} from '../services/loaction-srvc.service';
import {AppointmentSrvcService} from '../services/appointment-srvc.service';
import {EventSrvcService} from '../services/event-srvc.service';

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
  tempAppointment: any;
  AppointmentList: any;
  isAppoinment: boolean;
  count = 0;

  location: any;
  temp: any;
  event: any;
  temp1: any;
  constructor(
      private nav: NavController,
      private auth: AuthService,
      private storage: Storage,
      private appSrvc: AppointmentSrvcService,
      private locSrvc: LoactionSrvcService,
      private eventSrvc: EventSrvcService,
  ) { }

  ngOnInit() {
    this.AppointmentList = [];
    this.event = [];
    this.tempAppointment = [];
    this.isAppoinment = false;

    // ambil value logged
    this.storage.get('logged').then( value => {
      if (value === null){
        this.nav.navigateBack('/home');
      }
    });

    // ambil data location
    this.locSrvc.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data => {
      this.location = data;
      // console.log(this.location);
      for (const abc of this.location){
        abc.idloc = abc.key;
        delete abc.key;
        // console.log(abc);
      }
    });

    // ambil data event dan nama lokasi dan event
    this.eventSrvc.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data => {
      for (const abc of data){
        for (const keyloc of this.location){
          if (abc.keyLocation === keyloc.idloc){
            this.temp = abc;
            this.temp.addressLocation = keyloc.addressLocation;
            this.temp.cordinate = keyloc.cordinate;
            this.temp.nameLocation = keyloc.nameLocation;
            this.event.push(this.temp);
          }
        }
      }
      console.log(this.event);
    });

    // ambil uid
    this.auth.userUid().subscribe(res => {
      if (res !== null){
        this.userEmail = res.email;
        this.userID = res.uid;
      }
    }, err => {
      console.log(err);
    });

    // ambil data user, appointment dan memasukan nama event dan lokasi ke listappointment untuk di tampilkan
    this.auth.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data1 => {
      this.user = data1;
      for (const us of this.user){
        if (us.uid === this.userID){
          this.tempUser = [].concat(us);

        }
      }
      this.appSrvc.getAll().snapshotChanges().pipe(
          map(changes =>
              changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
      ).subscribe( data2 => {
        for (const ap of data2){
          if (ap.idUser === this.tempUser[0].key){
            // this.tempAppointment.push(ap);
            for (const events of this.event){
              if (ap.idEvent === events.key ){
                this.temp1 = ap;
                this.temp1.nameEvent = events.nameEvent;
                this.temp1.nameLocation = events.nameLocation;
                this.temp1.dateEvent = events.dateEvent;
                this.AppointmentList.push(this.temp1);
              }
            }

            this.isAppoinment = true;
          }
        }
      });
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

  toEditProfile(){
    this.nav.navigateBack('/menu/profile/profile-edit');
  }

}
