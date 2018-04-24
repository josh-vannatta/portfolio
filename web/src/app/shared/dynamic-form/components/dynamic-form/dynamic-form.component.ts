import { Component, Input, Output, OnInit, OnChanges, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';

import { ValidationService } from '@shared/validation/validation.service';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit, OnChanges {
  @Input() template: any = [];
  @Input('reset') reset: boolean;
  @Output() submitted = new EventEmitter<any>();
  @Output() submitData = new EventEmitter<any>();
  @Output() destroy = new EventEmitter<any>();
  filesToUpload = [];
  form: FormGroup;

  constructor(
    private builder: FormBuilder,
    private validation: ValidationService
   ) {}

  ngOnInit() {
    this.form = this.createGroup();
  }

  ngOnChanges() {
    if (this.reset == true) this.form.reset();
  }

  createGroup() {
    const group = this.builder.group({});
    this.template.forEach(control => {
      if (!control.value) control.value = '';
      control.textMask = control.mask ? this.getMask(control.mask) : null;
      let config;
      config = this.builder.control(
        control.value, this.validation.getValidators(control.rules)
      );
      if (control.element == 'array') config = this.getFormArray(control);
      group.addControl(control.name, config);
    });
    return group;
  }

  getFormArray(control) {
    let formArray = [];
    if (control.chosen)
      control.chosen.forEach(item=>{
        formArray.push( new FormControl(
          { name: item.name, id: item.id}
        ));
      });
    return new FormArray(formArray);
  }

  getMask(maskString) {
    let mask = maskString.split('');
    mask.forEach((char, i) => {
      if (char == '*') return mask[i] = /[\s\S]*/;
      if (char.match(/\d/)) return mask[i] = /\d/;
      if (char.match(/[A-Z]/)) return mask[i] = /[A-Z]/;
      if (char.match(/[a-z]/)) return mask[i] = /[a-z]/;
    })
    return { mask: mask };
  }

  uploadFile(file) {
    this.filesToUpload.push(file);
  }

  submitForm() {
    const fd = new FormData();

    for (const key in this.form.value){
      let value = this.form.value[key];
      if (typeof value !== 'string')
        value = JSON.stringify(value);
      fd.append(key, value);
    }

    this.filesToUpload.forEach((file)=>{
      fd.set(file.name, file.data);
    });
    this.submitted.emit(fd);
    this.submitData.emit(this.form.value);
  }

  delete() {
    const formData = new FormData();
    this.destroy.emit(formData);
  }

  resetForm() {
    this.form.reset();
  }

}
