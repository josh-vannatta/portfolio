import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressBarModule } from '@angular/material/progress-bar'

import { PopupComponent } from './components/popup.component';
import { DynamicFormModule } from '@shared/dynamic-form/dynamic-form.module';

import { PopupService } from './popup.service';
import { HtmlTemplatePipe } from '@pipes/html-template.pipe';

@NgModule({
  declarations: [
    PopupComponent
  ],
  imports: [
    CommonModule,
    MatProgressBarModule,
    DynamicFormModule
  ],
  exports: [
    PopupComponent
  ],
  providers: [
    PopupService
  ]
})
export class PopupModule { }
