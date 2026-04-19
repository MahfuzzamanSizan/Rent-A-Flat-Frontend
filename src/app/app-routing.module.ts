import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  },
  {
    path: 'owner',
    loadChildren: () => import('./features/owner/owner.module').then(m => m.OwnerModule),
    canActivate: [AuthGuard],
    data: { roles: ['OWNER'] }
  },
  {
    path: 'tenant',
    loadChildren: () => import('./features/tenant/tenant.module').then(m => m.TenantModule),
    canActivate: [AuthGuard],
    data: { roles: ['TENANT'] }
  },
  { path: 'unauthorized', redirectTo: '/auth/login' },
  { path: '**', redirectTo: '/auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
