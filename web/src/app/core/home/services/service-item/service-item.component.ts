import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

import { ServiceOffered } from '@shared/service/service-offered.model';
import { OfferingService } from '@shared/service/offering.service';
import { GlobalService } from '@shared/global.service';
import { PopupService } from '@shared/popup/popup.service';
import { AdminService } from '@auth/admin/admin.service';

@Component({
  selector: 'service-item',
  templateUrl: './service-item.component.html',
  styleUrls: ['./service-item.component.scss']
})
export class ServiceItemComponent implements OnInit {
  @Input() service: ServiceOffered;
  formTemplate;
  imagePath: string;

  constructor(
    private globals: GlobalService,
    public adminService: AdminService,
    private popupService: PopupService,
    private offeringService: OfferingService
  ) { }

  ngOnInit() {
    this.imagePath = this.globals.serverUrl + 'storage/services';
    this.formTemplate = [
      { element: 'input', label: 'Service name', name: 'name',
        rules: 'required', value: this.service.name
      },  {
        element: 'textarea', label: 'Description', name: 'description',
        rules: 'required|min:50', value: this.service.description
      },
      { element: 'upload', label: 'Service image (PNG)', name: 'image' },
      { element: 'upload', label: 'Service icon (SVG)', name: 'icon' },
      { element: 'button', buttons: [
          { type: 'submit', label: 'Submit', class: 'btn-primary gradient-focus'}
        ]}
    ];
  }

  showEditPopup() {
    this.popupService.newPopup(
      `Edit service '${this.service.name}'`, this.formTemplate
    );
    this.popupService.onSubmit()
      .subscribe((formData)=>this.handleService(formData, 'update'))
  }

  showDestroyPopup() {
    this.popupService.newPopup(
        `Delete service '${this.service.name}'?`, [
          { element: 'button', buttons: [{ type: 'submit', label: 'Confirm', class: 'btn-danger'}] }
        ], 'This will permanently remove this service from your list of services. There is no coming back from this!'
    );
    this.popupService.onSubmit()
      .subscribe((formData)=>this.handleService(formData, 'destroy'))
  }

  handleService(formData, url) {
    this.popupService.attempt();
    formData.append('id', `${this.service.id}`);
    this.offeringService.handleResource(formData, url)
      .subscribe(
        (response)=> this.popupService.reply('Success!', "Service successfully updated."),
        (error) => this.popupService.reply('Error!', error)
      );
  }

}
