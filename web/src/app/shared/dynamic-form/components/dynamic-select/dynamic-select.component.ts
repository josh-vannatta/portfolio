import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-select',
  templateUrl: './dynamic-select.component.html',
  styleUrls: ['./dynamic-select.component.scss']
})
export class DynamicSelectComponent{
  template;
  group: FormGroup;

  onInputValid(field: string) {
    return !this.group.get(field).valid && this.group.get(field).touched;
  }

}
