import { Component, OnInit } from '@angular/core';
import {LoactionSrvcService} from '../../services/loaction-srvc.service';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {ToastController} from '@ionic/angular';
import {Storage} from '@ionic/storage';
import {Location} from '../../model/location';

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.page.html',
  styleUrls: ['./add-location.page.scss'],
})
export class AddLocationPage implements OnInit {
  // location: any;
  newLoc: Location;
  coordinate: '';
  constructor(
      private srvc: LoactionSrvcService,
      private router: Router,
      private toastController: ToastController,
      private storage: Storage,
      ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.storage.get('coordinate')
        .then( value => {
          if (value !== null){
          this.coordinate = value;
          }
        });
  }

  ionViewWillLeave(){
    this.storage.get('coordinate')
        .then( value => {
          if (value !== null){
            this.storage.remove('coordinate');
          }
        });
  }

  onSubmit(form: NgForm){
    this.newLoc = {
      key: '',
      nameLocation: form.value.nameLocation,
      addressLocation: form.value.addressLocation,
      cordinate: this.coordinate
    };
    console.log(this.newLoc);

    this.srvc.create(this.newLoc);
    form.reset();
    this.presentToast();
    this.router.navigateByUrl('/menu/home-admin');

  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Location has been added.',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }

  toMap(){
    this.router.navigateByUrl('/menu/add-location/map');
  }

}
