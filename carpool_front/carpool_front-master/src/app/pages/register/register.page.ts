import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  constructor(public nav: NavController) { }

  ngOnInit() {
  }

  gotoDriver() {
    this.nav.navigateForward('driver-register');
  }

  gotoPassenger() {
    this.nav.navigateForward('passenger-register');
  }

}
