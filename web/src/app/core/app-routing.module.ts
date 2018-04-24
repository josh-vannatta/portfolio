import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';

import { Error404Component } from './error-404/error-404.component';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { AuthGuard } from '../auth/auth-guard.service';

const appRoutes: Routes = [
  { path: '',  component: HomeComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'error-404', component: Error404Component },
  { path: '**', redirectTo: '/error-404', pathMatch: 'full' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
