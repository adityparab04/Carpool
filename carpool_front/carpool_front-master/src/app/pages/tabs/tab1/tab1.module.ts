import { PassengerProfileComponent } from './../../../components/passenger-profile/passenger-profile.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { DriverProfileComponent } from 'src/app/components/driver-profile/driver-profile.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab1Page }])
  ],
  declarations: [
    Tab1Page,
    DriverProfileComponent,
    PassengerProfileComponent
  ]
})
export class Tab1PageModule {}
