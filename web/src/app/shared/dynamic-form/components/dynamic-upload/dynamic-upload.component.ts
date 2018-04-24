import { Component, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-upload',
  templateUrl: './dynamic-upload.component.html',
  styleUrls: ['./dynamic-upload.component.scss']
})
export class DynamicUploadComponent {
  group: FormGroup;
  selectedFile = 'No file selected';
  @Output() imageUpload = new EventEmitter<any>();
  template;

  touch() {
    this.group.controls[this.template.name].markAsPending();
    this.group.controls[this.template.name].markAsTouched();
  }

  onSVGSelected(event) {
    if (!event.target.files.length) {
      this.group.controls[this.template.name].setValue(null);
      this.selectedFile = 'No file selected';
      return;
    } else {
      this.selectedFile = event.target.files[0].name;
      this.group.controls[this.template.name].setValue(this.selectedFile);
      this.imageUpload.emit({
        data: event.target.files[0], name: this.template.name
      });
    }
  }
}
