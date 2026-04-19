import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellComponent } from '../layout/shell/shell.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsersComponent } from './users/users.component';
import { PropertiesComponent } from './properties/properties.component';
import { ComplaintsComponent } from './complaints/complaints.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { PlansComponent } from './plans/plans.component';
import { AreasComponent } from './areas/areas.component';
import { BroadcastComponent } from './broadcast/broadcast.component';

const routes: Routes = [
  {
    path: '', component: ShellComponent, children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'properties', component: PropertiesComponent },
      { path: 'complaints', component: ComplaintsComponent },
      { path: 'transactions', component: TransactionsComponent },
      { path: 'plans', component: PlansComponent },
      { path: 'areas', component: AreasComponent },
      { path: 'broadcast', component: BroadcastComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
