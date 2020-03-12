import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Tab3Page } from './tab3.page';
import { RequestRideComponent } from 'src/app/components/request-ride/request-ride.component';
import { CreateRideComponent } from 'src/app/components/create-ride/create-ride.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: Tab3Page }]),
    ReactiveFormsModule
  ],
  declarations: [
    Tab3Page,
    RequestRideComponent,
    CreateRideComponent
  ]
})
export class Tab3PageModule {}
