import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OwnerRoutingModule } from './owner-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { MaterialModule } from '../../shared/material.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { LeasesComponent } from './leases/leases.component';
import { LeaseFormComponent } from './lease-form/lease-form.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { OwnerChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [DashboardComponent, PropertiesComponent, PropertyFormComponent, InquiriesComponent, LeasesComponent, LeaseFormComponent, SubscriptionComponent, OwnerChatComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, OwnerRoutingModule, LayoutModule, MaterialModule]
})
export class OwnerModule {}
