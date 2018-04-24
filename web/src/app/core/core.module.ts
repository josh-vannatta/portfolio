// Base Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule, CanActivate } from '@angular/router';

// Componenents
import { HomeComponent } from './home/home.component';
import { HeroComponent } from './home/hero/hero.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Error404Component } from './error-404/error-404.component';
import { AboutComponent } from './home/about/about.component';
import { MissionComponent } from './home/mission/mission.component';
import { BiographyComponent } from './home/about/biography/biography.component';
import { SkillsComponent } from './home/about/skills/skills.component';
import { SkillItemComponent } from './home/about/skills/skill-item/skill-item.component';
import { ServicesComponent } from './home/services/services.component';
import { EditComponent } from './edit/edit.component';

// Helper Modules
import { SharedModule } from '@shared/shared.module';
import { PopupModule } from '@shared/popup/popup.module';

// Routes
import { AppRoutingModule } from './app-routing.module';

// Services
import { AuthService } from '@auth/auth.service';
import { AuthGuard } from '@auth/auth-guard.service';
import { AdminService } from '@auth/admin/admin.service';
import { ServiceItemComponent } from './home/services/service-item/service-item.component';
import { ContactComponent } from './contact/contact.component';
import { InteractiveThesisComponent } from './home/hero/interactive-thesis/interactive-thesis.component';

@NgModule({
  imports: [
    AppRoutingModule,
    SharedModule,
    PopupModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    Error404Component,
    HomeComponent,
    HeroComponent,
    FooterComponent,
    AboutComponent,
    MissionComponent,
    BiographyComponent,
    SkillsComponent,
    SkillItemComponent,
    ServicesComponent,
    EditComponent,
    ServiceItemComponent,
    ContactComponent,
    InteractiveThesisComponent
  ],
  exports: [
    AppRoutingModule,
    PopupModule,
    HeaderComponent,
    FooterComponent,
    EditComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    AdminService
  ]
})
export class CoreModule { }
