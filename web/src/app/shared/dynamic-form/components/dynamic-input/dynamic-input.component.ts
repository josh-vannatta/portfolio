import { Component, ViewContainerRef } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-input',
  templateUrl: './dynamic-input.component.html',
  styleUrls: ['./dynamic-input.component.scss']
})
export class DynamicInputComponent {
  template;
  group: FormGroup;

  onInputValid(field: string) {
    return !this.group.get(field).valid && this.group.get(field).touched;
  }

}
