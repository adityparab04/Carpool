import { AuthServiceService } from './../../providers/auth-service.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  public message;

  constructor(
    private formBuilder: FormBuilder,
    private _userService: UserService,
    private auth: AuthServiceService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: ['']
    });
  }

  ngOnInit() {
    if (this.auth.authenticated()) {
      this.router.navigate(['home']);
    }
  }

  submit() {
    console.log(this.loginForm.value);
    const body = {
      'username': this.loginForm.value.username,
      'password': this.loginForm.value.password
    };


    this._userService.userLogin(body)
      .subscribe(
        data => {
          console.log(data);
          this.auth.login(data);
          this.loginForm.reset();
          this.router.navigate(['home']);
        },
        err => {
          console.log('username and password is not matching');
          this.message = err.error.message;
        }
      );
  }
}
