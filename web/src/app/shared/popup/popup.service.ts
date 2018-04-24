import { Injectable, EventEmitter } from '@angular/core';

@Injectable()
export class PopupService {
  formSubmitted: EventEmitter<any> = new EventEmitter();

  formTemplate = [];
  willReturn: boolean = false;
  content = '';
  canClose: boolean = true;
  title: string = '';
  status: any = false;
  message: string = '';
  visible: boolean = false;
  attempting: boolean =  false;
  response: boolean =  false;

  constructor() { }

  getForm() {
    return this.formTemplate.slice(0);
  }

  newPopup(title, template = [], content = '') {
    this.visible = true;
    this.title = title;
    this.content = content;
    this.formTemplate = template;
  }

  submitForm(formData) {
    this.formSubmitted.emit(formData)
  }

  onSubmit() {
    return this.formSubmitted;
  }

  setForm(template) {
    this.formTemplate = template;
  }

  attempt() {
    this.attempting = true;
  }

  reply(status, message) {
    this.attempting = false;
    this.canClose = true;
    this.status = status;
    this.message = message;
    this.response = true;
    return this;
  }

  returnAfter() {
    this.willReturn = true;
  }

  closePopup() {
    if (!this.willReturn) {
      this.visible = false;
      this.formSubmitted = new EventEmitter();
      this.formTemplate = [];
      this.content = '';
      this.title = '';
      this.canClose = true;
    }
    this.message = '';
    this.status = false;
    this.attempting =  false;
    this.response =  false;
    this.willReturn = false;
  }
}
