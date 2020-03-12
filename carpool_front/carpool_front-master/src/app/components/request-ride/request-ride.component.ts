import { PassengerService } from 'src/app/service/passenger.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/service/driver.service';

@Component({
  selector: 'app-request-ride',
  templateUrl: './request-ride.component.html',
  styleUrls: ['./request-ride.component.scss'],
})
export class RequestRideComponent implements OnInit {

  public showForm = false;

  public RequestRideForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private _passengerSerivce: PassengerService,
    private _driverService: DriverService,
    private router: Router
  ) {
    this.RequestRideForm = this.formBuilder.group({
      source: [''],
      destination: [''],
      timing: [''],
      fare: ['']
    });
  }

  ngOnInit() {
    this._passengerSerivce.PassengerRequestedRide()
      .subscribe(
        data => {
          console.log(data);
          if (data.ride !== undefined) {
            this.showForm = false;
          } else {
            this._passengerSerivce.PassengerAcceptedRide()
            .subscribe(
              data => {
                console.log(data);
                if (data.ride !== undefined) {
                  this.showForm = false;
                } else {
                  this.showForm = true;
                }
              },
              err => {
                console.log(err.error.message);
              }
            );
          }
        },
        err => {
          console.log(err.error.message);
        }
      );


      const channel = this._driverService.init();
      channel.bind('requestedRide', (message) => {
        this._passengerSerivce.PassengerRequestedRide()
          .subscribe(
            data => {
              console.log(data);
              if (data.ride !== undefined) {
                this.showForm = false;
              } else {
                this._passengerSerivce.PassengerAcceptedRide()
                .subscribe(
                  data => {
                    console.log(data);
                    if (data.ride !== undefined) {
                      this.showForm = false;
                    } else {
                      this.showForm = true;
                    }
                  },
                  err => {
                    console.log(err.error.message);
                  }
                );
              }
            },
            err => {
              console.log(err.error.message);
            }
          );
      });
  }

  submit() {
    const body = {
      'requested_by': localStorage.getItem('username'),
      'passenger_id': localStorage.getItem('userid'),
      'source': this.RequestRideForm.value.source,
      'destination': this.RequestRideForm.value.destination,
      'timing': this.RequestRideForm.value.timing,
      'fare': this.RequestRideForm.value.fare,
    };
    this._passengerSerivce.requestRide(body)
      .subscribe(
        data => {
          console.log(data);
          this.RequestRideForm.reset();
          this.router.navigate(['/home/tabs/tab1']);
        },
        err => {
          console.log(err.error.message);
        }
      );
  }

}
