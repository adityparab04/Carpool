import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {
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
