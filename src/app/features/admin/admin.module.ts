import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminRoutingModule } from './admin-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { MaterialModule } from '../../shared/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { PropertiesComponent } from './properties/properties.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PlansComponent } from './plans/plans.component';
import { AreasComponent } from './areas/areas.component';
import { BroadcastComponent } from './broadcast/broadcast.component';

@NgModule({
  declarations: [
    DashboardComponent, UsersComponent, PropertiesComponent, ComplaintsComponent,
    TransactionsComponent, PlansComponent, AreasComponent, BroadcastComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, AdminRoutingModule, LayoutModule, MaterialModule]
})
export class AdminModule {}
