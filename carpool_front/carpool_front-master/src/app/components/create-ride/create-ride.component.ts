import { PassengerService } from './../../service/passenger.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DriverService } from 'src/app/service/driver.service';

@Component({
  selector: 'app-create-ride',
  templateUrl: './create-ride.component.html',
  styleUrls: ['./create-ride.component.scss'],
})
export class CreateRideComponent implements OnInit{

  public CreateRideForm: FormGroup;
  public showForm = false;

  constructor(
    private formBuilder: FormBuilder,
    private _driverService: DriverService,
    private _passengerService: PassengerService,
    private router: Router
  ) {
    this.CreateRideForm = this.formBuilder.group({
      source: [''],
      destination: [''],
      timing: [''],
      fare: [''],
      available_seats: ['']
    });
  }

  ngOnInit() {
    this._driverService.DriverCreatedRide()
      .subscribe(
        data => {
          console.log(data);
          if (data.ride !== undefined) {
            this.showForm = false;
          } else {
            this._driverService.DriverAcceptedRide()
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

    const channel = this._passengerService.init();

    channel.bind('createRide', (message) => {
      this._driverService.DriverCreatedRide()
      .subscribe(
        data => {
          console.log(data);
          if (data.ride !== undefined) {
            this.showForm = false;
          } else {
            this._driverService.DriverAcceptedRide()
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
      'created_by': localStorage.getItem('username'),
      'driver_id': localStorage.getItem('userid'),
      'source': this.CreateRideForm.value.source,
      'destination': this.CreateRideForm.value.destination,
      'timing': this.CreateRideForm.value.timing,
      'fare': this.CreateRideForm.value.fare,
      'available_seats': this.CreateRideForm.value.available_seats
    };
    this._driverService.createRide(body)
      .subscribe(
        data => {
          console.log(data);
          this.CreateRideForm.reset();
          this.router.navigate(['/home/tabs/tab1']);
        },
        err => {
          console.log(err.error.message);
        }
      );
  }

}
