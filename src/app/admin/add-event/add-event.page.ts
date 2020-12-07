import { Component, OnInit } from '@angular/core';
import {LoactionSrvcService} from '../../services/loaction-srvc.service';
import {EventSrvcService} from '../../services/event-srvc.service';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ToastController} from '@ionic/angular';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.page.html',
  styleUrls: ['./add-event.page.scss'],
})
export class AddEventPage implements OnInit {
  location: any;
  constructor(
      private locSrvc: LoactionSrvcService,
      private evenSrvc: EventSrvcService,
      private router: Router,
      private toastController: ToastController
  ) { }

  ngOnInit() {
    this.locSrvc.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data => {
      this.location = data;
      console.log(this.location);
    });

  }

  onSubmit(form: NgForm){
    this.evenSrvc.create(form.value).then(res => {
      console.log(res);
      this.presentToast();
      this.router.navigateByUrl('/menu/home-admin');
    }).catch(error => console.log(error));

    form.reset();
    this.router.navigateByUrl('/menu/home-admin');
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Event has been added.',
      color: 'success',
      duration: 2000
    });
    toast.present();
  }

}
