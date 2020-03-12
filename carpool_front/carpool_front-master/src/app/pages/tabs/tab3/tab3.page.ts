import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {
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
