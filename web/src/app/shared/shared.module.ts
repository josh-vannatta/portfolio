import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NgxPageScrollModule } from 'ngx-page-scroll';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { SkillService } from './skill/skill.service';
import { OfferingService } from './service/offering.service';
import { GoogleMapsService } from './google-maps/google-maps.service';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';

import { ClickOutsideDirective } from '@directives/click-outside.directive';
import { HtmlTemplatePipe } from '@pipes/html-template.pipe';

@NgModule({
  declarations: [
    ClickOutsideDirective,
    HtmlTemplatePipe
  ],
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    CommonModule,
    MDBBootstrapModule,
    NgxPageScrollModule,
    FormsModule,
    DynamicFormModule,
    ClickOutsideDirective,
    HtmlTemplatePipe
  ],
  providers: [
    SkillService,
    OfferingService,
    GoogleMapsService
  ]
})
export class SharedModule { }
