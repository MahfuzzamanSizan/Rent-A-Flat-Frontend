import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from '../layout/shell/shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyFormComponent } from './property-form/property-form.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { LeasesComponent } from './leases/leases.component';
import { LeaseFormComponent } from './lease-form/lease-form.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { OwnerChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '', component: ShellComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'properties', component: PropertiesComponent },
      { path: 'properties/new', component: PropertyFormComponent },
      { path: 'properties/:id/edit', component: PropertyFormComponent },
      { path: 'inquiries', component: InquiriesComponent },
      { path: 'leases', component: LeasesComponent },
      { path: 'leases/new', component: LeaseFormComponent },
      { path: 'subscription', component: SubscriptionComponent },
      { path: 'chat', component: OwnerChatComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OwnerRoutingModule {}
