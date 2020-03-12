import { PassengerService } from 'src/app/service/passenger.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { AuthServiceService } from 'src/app/providers/auth-service.service';
import { Router } from '@angular/router';
import { Driver } from 'src/app/httpObjects/driver';
import { CreatedRide } from 'src/app/httpObjects/createdride';
import { AcceptedRide } from 'src/app/httpObjects/acceptedride';
import { DriverService } from 'src/app/service/driver.service';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss'],
})
export class DriverProfileComponent implements OnInit {
  public driver: Driver;
  public createdRide: CreatedRide;
  public acceptedRide: AcceptedRide;
  public mobileno: string;

  public showcreateRide = false;
  public showaccepteRide = false;
  public showButton = false;

  constructor(
    private auth: AuthServiceService,
    private router: Router,
    private _driverService: DriverService,
    private _passengerService: PassengerService
  ) { }

  loadProfile() {
    this._driverService.driverProfile()
      .subscribe(data => {
        this.driver = data.driver;
        this.createdRide = data.created_ride;
        this.acceptedRide = data.accepted_ride;
        console.log(this.driver);
        console.log(this.createdRide);
        console.log(this.acceptedRide);

        this.mobileno = this.acceptedRide.passenger_mobile_no;

        if (this.createdRide.driver_id === undefined) {
          this.showcreateRide = false;
        } else {
          this.showcreateRide = true;
        }

        if (this.acceptedRide.driver_name === undefined) {
          this.showaccepteRide = false;
        } else {
          this.showaccepteRide = true;
        }

        if (this.acceptedRide.passenger_id === undefined && this.createdRide.driver_id === undefined) {
          this.showButton = true;
        } else {
          this.showButton = false;
        }
      });
  }

  ngOnInit() {
    this.loadProfile();

    const channel1 = this._driverService.init();
    const channel2 = this._passengerService.init();

    const eventname = 'acceptRide'+localStorage.getItem('userid');

    channel1.bind(eventname, (message) => {
      this.loadProfile();
    });

    channel2.bind('createRide', (message) => {
      this.loadProfile();
    })
  }


  deleteCreateRide(data) {
    const body = {
      'create_ride_id': data,
      'driver_id': localStorage.getItem('userid')
    };
    this._driverService.deleteCreateRide(body)
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

  deleteAccepRide(data) {
    const body = {
      'accept_ride_id': data,
      'driver_id': localStorage.getItem('userid')
    };
    this._driverService.deleteAcceptRide(body)
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
