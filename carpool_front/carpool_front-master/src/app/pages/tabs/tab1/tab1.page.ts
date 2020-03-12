import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  public showDriver = false;
  public showPassenger = false;

  constructor() {}

  ngOnInit() {
    if (localStorage.getItem('usertype') === 'driver') {
      this.showDriver = true;
    } else if (localStorage.getItem('usertype') === 'passenger') {
      this.showPassenger = true;
    } else {
      return;
    }
  }
}
