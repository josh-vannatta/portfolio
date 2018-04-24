import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-textarea',
  templateUrl: './dynamic-textarea.component.html',
  styleUrls: ['./dynamic-textarea.component.scss']
})
export class DynamicTextareaComponent{
  template;
  group: FormGroup;

  onInputValid(field: string) {
    return !this.group.get(field).valid && this.group.get(field).touched;
  }

}
