import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PopupService} from '../popup.service';

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  responses = [ 'Gotcha!', 'Swell!', 'Neato!', 'Cool.', 'If you say so!' ];
  response = this.responses[Math.floor(Math.random() * this.responses.length)];

  constructor(
    public service: PopupService
  ) { }

  ngOnInit() {
  }

  close() {
    this.service.closePopup();
  }

  submitForm(formData) {
    this.service.submitForm(formData);
  }

}
