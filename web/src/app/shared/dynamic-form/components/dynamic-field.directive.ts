import { ComponentFactoryResolver, Directive, Input, Output, OnInit, ViewContainerRef, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { DynamicInputComponent } from './dynamic-input/dynamic-input.component';
import { DynamicSelectComponent } from './dynamic-select/dynamic-select.component';
import { DynamicUploadComponent } from './dynamic-upload/dynamic-upload.component';
import { DynamicButtonComponent } from './dynamic-button/dynamic-button.component';
import { DynamicTextareaComponent } from './dynamic-textarea/dynamic-textarea.component';
import { DynamicArrayComponent } from './dynamic-array/dynamic-array.component';

const components = {
  input: DynamicInputComponent,
  select: DynamicSelectComponent,
  upload: DynamicUploadComponent,
  button: DynamicButtonComponent,
  textarea: DynamicTextareaComponent,
  array: DynamicArrayComponent
}

@Directive({
  selector: '[dynamicField]'
})
export class DynamicFieldDirective implements OnInit {
  @Input() template;
  @Input() group: FormGroup;
  @Output() fileUploaded = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  @Output() reset = new EventEmitter<any>();
  component;

  constructor(
    private resolver: ComponentFactoryResolver,
    private container: ViewContainerRef
  ) {}

  ngOnInit() {
    const component = components[this.template.element];
    const factory = this.resolver.resolveComponentFactory<any>(component)
    this.component = this.container.createComponent(factory);
    this.component.instance.template = this.template;
    this.component.instance.group = this.group;

    let className = this.template.class ? "col-12 " + this.template.class : "col-12";
    this.component.hostView.rootNodes[0].className = className;

    if (this.template.element == 'upload') {
      this.component.instance.imageUpload
        .subscribe((file) => this.fileUploaded.emit(file));
    }
    if (this.template.element == 'button') {
      this.component.instance.delete
        .subscribe((id) => this.delete.emit(id));
      this.component.instance.reset
        .subscribe(() => this.reset.emit());
    }
  }
}
