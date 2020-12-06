import { Component, OnInit } from '@angular/core';
import {EventSrvcService} from '../services/event-srvc.service';
import {map} from 'rxjs/operators';
import {LoactionSrvcService} from '../services/loaction-srvc.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  event: any;
  location: any;
  temp: any;
  constructor(
      private eventSrvc: EventSrvcService,
      private locSrvc: LoactionSrvcService,
              ) { }

  ngOnInit() {
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
            // console.log(this.temp);
          }
        }
      }
    });
  }

}
