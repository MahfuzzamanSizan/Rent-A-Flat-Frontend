import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from '../layout/shell/shell.component';
import { HomeComponent } from './home/home.component';
import { PropertyDetailComponent } from './property-detail/property-detail.component';
import { InquiriesComponent } from './inquiries/inquiries.component';
import { LeasesComponent } from './leases/leases.component';
import { ShortlistComponent } from './shortlist/shortlist.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { TenantChatComponent } from './chat/chat.component';

const routes: Routes = [
  {
    path: '', component: ShellComponent, children: [
      { path: 'home', component: HomeComponent },
      { path: 'properties/:id', component: PropertyDetailComponent },
      { path: 'inquiries', component: InquiriesComponent },
      { path: 'leases', component: LeasesComponent },
      { path: 'shortlist', component: ShortlistComponent },
      { path: 'subscription', component: SubscriptionComponent },
      { path: 'chat', component: TenantChatComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TenantRoutingModule {}
