import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { MatProgressBarModule } from '@angular/material/progress-bar'

import { SignupComponent } from './signup/signup.component';
import { SigninComponent } from './signin/signin.component';
import { AuthGuard } from '../auth/auth-guard.service';

import { SharedModule } from '../shared/shared.module';
import { AdminComponent } from './admin/admin.component';

const authRoutes: Routes = [
  { path: 'signup',  component: SignupComponent },
  { path: 'signin',  component: SigninComponent },
  { path: 'admin',  component: AdminComponent },
]

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(authRoutes),
    MatProgressBarModule
  ],
  declarations: [
    SignupComponent,
    SigninComponent,
    AdminComponent
  ],
  exports: [
    RouterModule
  ]
})
export class AuthModule { }
