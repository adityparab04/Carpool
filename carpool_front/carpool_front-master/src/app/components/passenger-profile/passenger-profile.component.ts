import { AcceptedRide } from './../../httpObjects/acceptedride';
import { Passenger } from './../../httpObjects/passenger';
import { Component, OnInit, AfterContentChecked, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/providers/auth-service.service';
import { PassengerService } from '../../service/passenger.service';
import { RequestedRide } from 'src/app/httpObjects/requestedride';
import { DriverService } from 'src/app/service/driver.service';

@Component({
  selector: 'app-passenger-profile',
  templateUrl: './passenger-profile.component.html',
  styleUrls: ['./passenger-profile.component.scss'],
})
export class PassengerProfileComponent implements OnInit {
  public passenger: Passenger;
  public requestedRide: RequestedRide;
  public acceptedRide: AcceptedRide;

  public mobileno: string;

  public showrequestRide = false;
  public showaccepteRide = false;
  public showButton = false;

  constructor(
    private auth: AuthServiceService,
    private router: Router,
    private _passengerService: PassengerService,
    private _driverService: DriverService
  ) { }

  loadProfile() {
    this._passengerService.passengerProfile()
    .subscribe(data => {
      this.passenger = data.passenger;
      this.requestedRide = data.requested_ride;
      this.acceptedRide = data.accepted_ride;
      console.log(this.passenger);
      console.log(this.requestedRide);
      console.log(this.acceptedRide);
      this.mobileno = this.acceptedRide.driver_mobile_no;

      if (this.requestedRide.passenger_id === undefined) {
        this.showrequestRide = false;
      } else {
        this.showrequestRide = true;
      }

      if (this.acceptedRide.driver_name === undefined) {
        this.showaccepteRide = false;
      } else {
        this.showaccepteRide = true;
      }

      if (this.acceptedRide.passenger_id === undefined && this.requestedRide.passenger_id === undefined) {
        this.showButton = true;
      } else {
        this.showButton = false;
      }
    });
  }

  ngOnInit() {
    this.loadProfile();

    const channel1 = this._passengerService.init();
    const channel2 = this._driverService.init();

    const eventname = 'acceptRide'+localStorage.getItem('userid');

    channel1.bind(eventname, (message) => {
        this.loadProfile();
    });

    channel2.bind('requestedRide', (message) => {
      this.loadProfile();
    })
  }


  deleteRequestedRide(data) {
    const body = {
      'request_ride_id': data,
      'passenger_id': localStorage.getItem('userid')
    };
    this._passengerService.deleteRequestRide(body)
      .subscribe(
        data => {
          console.log(data);
          this.ngOnInit();
        },
        err => {
          console.log(err);
          console.log(err.error.message);
        }
      )
  }

  deleteAccepRide(data) {
    const body = {
      'accept_ride_id': data,
      'passenger_id': localStorage.getItem('userid')
    };
    this._passengerService.deleteAcceptRide(body)
      .subscribe(
        data => {
          console.log(data);
          this.ngOnInit();
        },
        err => {
          console.log(err);
          console.log(err.error.message);
        }
      );
  }

  contact() {
    window.open('https://api.whatsapp.com/send?phone=91'+ this.mobileno, '_system');
  }

  submit() {
    console.log('clicked');
    this.auth.logout();
    this.router.navigate(['']);
  }
}
