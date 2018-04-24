import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'dynamic-array',
  templateUrl: './dynamic-array.component.html',
  styleUrls: ['./dynamic-array.component.scss']
})
export class DynamicArrayComponent implements OnInit {
  template;
  group: FormGroup;
  items: FormArray;
  itemsList: any[] = [];

  constructor() { }

  ngOnInit() {
    this.items = <FormArray>this.group.controls[this.template.name];
    this.itemsList = this.template.array;
    this.itemsList.forEach(item=>{
      item.chosen = this.findControlById(item.id);
    });
  }

  getItems(group) {
    return group.get(this.template.name).controls;
  }

  addItem(selector): void {
    if (selector.value !== ''){
      this.itemsList[selector.value].chosen = true;
      this.items.push(
        new FormControl({
          name: this.itemsList[selector.value].name,
          id: this.itemsList[selector.value].id
        })
      );
    }
  }

  removeItem(id, index) {
    this.itemsList[this.findById(id)].chosen = false;
    this.items.removeAt(index);
  }

  findById(id): number {
    for (let i = 0; i < this.itemsList.length; i++){
      if (this.itemsList[i].id == id) return i;
    }
  }

  findControlById(id): boolean {
    let exists = false;
    this.items.controls.forEach(control=>{
      if (control.value.id == id) return exists = true;
    });
    return exists;
  }

}
