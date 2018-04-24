import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'dynamic-button',
  templateUrl: './dynamic-button.component.html',
  styleUrls: ['./dynamic-button.component.scss']
})
export class DynamicButtonComponent implements OnInit {
  template;
  group: FormGroup;
  noOfInputs: number;
  @Output() delete = new EventEmitter<any>();
  @Output() reset = new EventEmitter<any>();

  ngOnInit() {
    this.noOfInputs = Object.keys(this.group.controls).length;
  }


  call(output: string, params: any = '') {
    if (output) this[output].emit();
  }
}
