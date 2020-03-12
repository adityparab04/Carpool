import { Component, OnInit } from '@angular/core';
import { DriverService } from 'src/app/service/driver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-requested-ride',
  templateUrl: './all-requested-ride.component.html',
  styleUrls: ['./all-requested-ride.component.scss'],
})
export class AllRequestedRideComponent implements OnInit {

  public data;
  public requestedRide;
  public show = false;

  constructor(
    private _driverService: DriverService,
    private router: Router,
  ) { }

  loaddata() {
    this._driverService.DriverAcceptedRide()
      .subscribe(
        data => {
          console.log(data);
          if (data.ride !== undefined) {
            this.show = false;
          } else {
            this.show = true;
            this._driverService.getRequestRide()
              .subscribe(data => {
                this.data = data;
                this.requestedRide = this.data.requestedRide;
                console.log(this.requestedRide);
              });

              const channel = this._driverService.init();
              channel.bind('requestedRide', (message) => {
                this._driverService.getRequestRide()
                .subscribe(data => {
                  this.data = data;
                  this.requestedRide = this.data.requestedRide;
                  console.log(this.requestedRide);
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
      'request_ride_id': data,
      'driver_id': localStorage.getItem('userid')
    }
    this._driverService.acceptRide(body)
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
