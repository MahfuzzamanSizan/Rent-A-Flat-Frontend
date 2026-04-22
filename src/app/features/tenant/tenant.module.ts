import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TenantRoutingModule } from './tenant-routing.module';
import { LayoutModule } from '../layout/layout.module';
import { MaterialModule } from '../../shared/material.module';
import { HomeComponent } from './home/home.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { LeasesComponent } from './leases/leases.component';
import { ShortlistComponent } from './shortlist/shortlist.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { TenantChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [HomeComponent, PropertyDetailComponent, InquiriesComponent, LeasesComponent, ShortlistComponent, SubscriptionComponent, TenantChatComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, TenantRoutingModule, LayoutModule, MaterialModule]
})
export class TenantModule {}
