import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/providers/auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit{

  constructor(
    private authService: AuthServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.authenticated()) {
      this.router.navigate(['']);
    }
  }
}
