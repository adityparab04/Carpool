import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { PassengerService } from 'src/app/service/passenger.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-passenger-register',
  templateUrl: './passenger-register.page.html',
  styleUrls: ['./passenger-register.page.scss'],
})
export class PassengerRegisterPage implements OnInit {

  public passengerRegisterForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private _passengerService: PassengerService,
    private router: Router
  ) {
    this.passengerRegisterForm = this.formBuilder.group({
      username: [''],
      name: [''],
      password: [''],
      mobile_no: [''],
    });
   }

  ngOnInit() {
  }

  submit() {
    console.log(this.passengerRegisterForm.value);
    const body = this.passengerRegisterForm.value;
    this._passengerService.registerPassenger(body)
      .subscribe(
        data => {
          console.log(data);
          this.passengerRegisterForm.reset();
          this.router.navigate(['']);
        },
        err => {
          console.log(err.error.message);
        }
      );
  }

}
