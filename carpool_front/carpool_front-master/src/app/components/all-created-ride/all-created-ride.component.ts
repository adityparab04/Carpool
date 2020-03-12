import { DriverService } from 'src/app/service/driver.service';
import { PassengerService } from './../../service/passenger.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-created-ride',
  templateUrl: './all-created-ride.component.html',
  styleUrls: ['./all-created-ride.component.scss'],
})
export class AllCreatedRideComponent implements OnInit{

  public data;
  public createdRide;

  public show = false;

  constructor(
    private _passengerService: PassengerService,
    private _driverService: DriverService,
    private router: Router,
  ) { }

  loaddata() {
    this._passengerService.PassengerAcceptedRide()
    .subscribe(
      data => {
        console.log(data);
        if (data.ride !== undefined) {
          this.show = false;
        } else {
          this.show = true;
          this._passengerService.getCreatedRide()
          .subscribe(data => {
            this.data = data;
            this.createdRide = this.data.createdRide;
            console.log(this.createdRide);
          });

          const channel = this._passengerService.init();
          channel.bind('createRide', (message) => {
            this._passengerService.getCreatedRide()
            .subscribe(data => {
              this.data = data;
              this.createdRide = this.data.createdRide;
              console.log(this.createdRide);
            });
          });
        }
      },
      err => {
        console.log(err.error.message);
      }
    );
  }

  ngOnInit() {
    this.loaddata();
  }

  acceptRide(data) {
    console.log(data);
    const body = {
      'create_ride_id': data,
      'passenger_id': localStorage.getItem('userid')
    }
    this._passengerService.acceptRide(body)
      .subscribe(
        data => {
          console.log(data);
          this.router.navigate(['/home/tabs/tab1']);
        },
        err => {
          console.log(err);
        }
      );
  }

}
