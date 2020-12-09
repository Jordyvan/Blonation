import { Component, OnInit } from '@angular/core';
import {IonItemSliding, ToastController} from '@ionic/angular';
import {LoactionSrvcService} from '../../services/loaction-srvc.service';
import {map} from 'rxjs/operators';
import {EventSrvcService} from '../../services/event-srvc.service';
import {AppointmentSrvcService} from '../../services/appointment-srvc.service';
import {AuthService} from '../../services/auth.service';
import {attachView} from '@ionic/angular/providers/angular-delegate';

@Component({
  selector: 'app-home-admin',
  templateUrl: './home-admin.page.html',
  styleUrls: ['./home-admin.page.scss'],
})
export class HomeAdminPage implements OnInit {
  location: any;
  event: any;
  applicant: any;
  tempApplicant: any;
  user: any;
  temp: any;

  massageToast: string;
  colorToast: string;

  type: string;
  constructor(
      private locSrvc: LoactionSrvcService,
      private eventSrvc: EventSrvcService,
      private appointmentSrvc: AppointmentSrvcService,
      private auths: AuthService,
      private toastController: ToastController,
  ) { }

  ngOnInit() {
    this.type = 'aplicants';
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

    this.eventSrvc.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data => {
      this.event = data;
      for (const abc of this.event){
        for (const keyloc of this.location){
          if (abc.keyLocation === keyloc.idloc){
            this.temp = abc;
            this.temp.addressLocation = keyloc.addressLocation;
            this.temp.cordinate = keyloc.cordinate;
            this.temp.nameLocation = keyloc.nameLocation;
          }
        }
      }
    });
    this.auths.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data1 => {
      this.user = data1;
    });

    this.appointmentSrvc.getAll().snapshotChanges().pipe(
        map(changes =>
            changes.map(c => ({key: c.payload.key, ...c.payload.val()})))
    ).subscribe( data => {
      this.applicant = data;
      for (const abc of this.applicant){
          for (const event of this.event) {
            if (abc.idEvent === event.key) {
              this.tempApplicant = abc;
              this.tempApplicant.nameEvent = event.nameEvent;
            }
          }
          for (const user of this.user) {
            if (abc.idUser === user.key) {
              this.tempApplicant.nameUser = user.nameFull;
              if (user.bloodtype === '1') {
                this.tempApplicant.golonganDarah = 'A';
              }
              if (user.bloodtype === '2') {
                this.tempApplicant.golonganDarah = 'B';
              }
              if (user.bloodtype === '3') {
                this.tempApplicant.golonganDarah = 'AB';
              }
              if (user.bloodtype === '4') {
                this.tempApplicant.golonganDarah = 'O';
              }
            }
          }
      }


    });

    //
  }

  onFilterUpdate(event: CustomEvent){
    // console.log(event.detail);
  }


  accAplicant( slidingItem: IonItemSliding , id: string){
    slidingItem.close();
    // update appointment
    const tempApplicant = this.applicant.find(x => x.key === id);
    tempApplicant.status = true;
    delete tempApplicant.nameUser;
    delete tempApplicant.golonganDarah;
    delete tempApplicant.nameEvent;
    this.appointmentSrvc.update(tempApplicant.key, tempApplicant);

    // set user.lastdonateDate menjadi +30 hari dari event
    const tempEvent = this.event.find(x => x.key === tempApplicant.idEvent);
    const dateEvent = new Date(tempEvent.dateEvent);
    const dateUser = dateEvent.setDate(dateEvent.getDate() + 30);
    const tempUser = this.user.find(x => x.key === tempApplicant.idUser);
    tempUser.donated = 'false';
    tempUser.lastDonateDate = dateEvent;
    console.log(tempUser);
    // update ke firabase
    this.auths.update(tempUser.key, tempUser);

    this.massageToast = 'Appointment has been updated';
    this.colorToast = 'success';
    this.presentToast();
  }

  declineAplicant(slidingItem: IonItemSliding, id: string){
    slidingItem.close();
    // delete appointment
    const tempApplicant = this.applicant.find(x => x.key === id);
    this.appointmentSrvc.delete(tempApplicant.key);

    // update user lastDonatedDate
    const tempUser = this.user.find(x => x.key === tempApplicant.idUser);
    tempUser.donated = 'false';
    tempUser.lastDonateDate = '';

    this.auths.update(tempUser.key, tempUser);

    this.massageToast = 'Appointment has been deleted';
    this.colorToast = 'warning';
    this.presentToast();
  }

  hapusEvent(slidingItem: IonItemSliding, id: string){
    slidingItem.close();
    const tempEvent = this.event.find(x => x.key === id);
    const tempApplicant = this.applicant.filter(x => x.idEvent === id);
    console.log(tempApplicant);
    for (const applican of tempApplicant){
      const tempUser = this.user.filter(x => x.key === applican.idUser);
      for (const us of tempUser){
        us.donated = 'false';
        us.lastDonateDate = '';
        this.auths.update(us.key, us);
      }
      this.appointmentSrvc.delete(applican.key);
    }
    this.eventSrvc.delete(id);

    this.massageToast = 'Event has been deleted';
    this.colorToast = 'danger';
    this.presentToast();
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: this.massageToast,
      color: this.colorToast,
      duration: 2000
    });
    toast.present();
  }

}
