import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { TextMaskModule } from 'angular2-text-mask';

import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { DynamicSelectComponent } from './components/dynamic-select/dynamic-select.component';
import { DynamicButtonComponent } from './components/dynamic-button/dynamic-button.component';
import { DynamicUploadComponent } from './components/dynamic-upload/dynamic-upload.component';
import { DynamicTextareaComponent } from './components/dynamic-textarea/dynamic-textarea.component';
import { DynamicArrayComponent } from './components/dynamic-array/dynamic-array.component';

import { ValidationService } from '@shared/validation/validation.service';
import { DynamicFieldDirective } from './components/dynamic-field.directive';
import { FormErrorPipe } from '@pipes/form-error.pipe';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MDBBootstrapModule,
    TextMaskModule
  ],
  declarations: [
    DynamicFieldDirective,
    DynamicFormComponent,
    DynamicInputComponent,
    DynamicSelectComponent,
    DynamicButtonComponent,
    DynamicUploadComponent,
    DynamicTextareaComponent,
    DynamicArrayComponent,
    FormErrorPipe,
  ],
  exports: [
    DynamicFormComponent
  ],
  entryComponents: [
    DynamicInputComponent,
    DynamicSelectComponent,
    DynamicButtonComponent,
    DynamicUploadComponent,
    DynamicArrayComponent,  
    DynamicTextareaComponent
  ],
  providers: [
    ValidationService
  ],
})
export class DynamicFormModule { }
