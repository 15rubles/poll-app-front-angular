import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleGuardGuard } from './guards/role-guard.guard';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LeadLayoutComponent } from './layouts/lead-layout/lead-layout.component';
import { RegistrationLayoutComponent } from './layouts/registration-layout/registration-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
  //Auth
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: [environment.UNAUTHORIZED]
    },
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        loadChildren: () => import('./routings/auth/auth.module')
          .then(m => m.AuthModule)
      }
    ]
  },
  //registration
  {
    path: 'registration',
    component: RegistrationLayoutComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: [environment.UNAUTHORIZED]
    },
    children: [
      {
        path: 'registration',
        loadChildren: () => import('./routings/registration/registration.module')
          .then(m => m.RegistrationModule)
      }
    ]
  },
  //user
  {
    path: 'user',
    component: UserLayoutComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: [environment.ROLE_USER]
    },
    children: [
      {
        path: 'user',
        loadChildren: () => import('./routings/user/user.module')
          .then(m => m.UserModule)
      }
    ]
  },
  //lead
  {
    path: 'lead',
    component: LeadLayoutComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: [environment.ROLE_LEAD]
    },
    children: [
      {
        path: 'lead',
        loadChildren: () => import('./routings/lead/lead.module')
          .then(m => m.LeadModule)
      }
    ]
  },
  //admin
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [RoleGuardGuard],
    data: {
      expectedRoles: [environment.ROLE_ADMIN]
    },
    children: [
      {
        path: 'admin',
        loadChildren: () => import('./routings/admin/admin.module')
          .then(m => m.AdminModule)
      }
    ]
  },
  //404
  {
    path: '**',
    redirectTo: '/login'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
