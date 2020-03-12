import { AllRequestedRideComponent } from './../../../components/all-requested-ride/all-requested-ride.component';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab2Page } from './tab2.page';
import { AllCreatedRideComponent } from 'src/app/components/all-created-ride/all-created-ride.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab2Page }])
  ],
  declarations: [
    Tab2Page,
    AllRequestedRideComponent,
    AllCreatedRideComponent
  ]
})
export class Tab2PageModule {}
