import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { DriverService } from 'src/app/service/driver.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-driver-register',
  templateUrl: './driver-register.page.html',
  styleUrls: ['./driver-register.page.scss'],
})
export class DriverRegisterPage implements OnInit {

  public driverRegisterForm: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private _driverService: DriverService,
    private router: Router
  ) {
    this.driverRegisterForm = this.formBuilder.group({
      username: [''],
      name: [''],
      password: [''],
      mobile_no: [''],
      vehicle_type: [''],
      license_no: ['']
    });
  }

  ngOnInit() {
  }

  submit() {
    console.log(this.driverRegisterForm.value);
    const body = this.driverRegisterForm.value;
    this._driverService.registerDriver(body)
      .subscribe(
        data => {
          console.log(data);
          this.driverRegisterForm.reset();
          this.router.navigate(['']);
        },
        err => {
          console.log(err.error.message);
        }
      );
  }

}
