import { Component, OnInit } from '@angular/core';

import { OfferingService } from '@shared/service/offering.service';
import { ServiceOffered } from '@shared/service/service-offered.model';
import { AdminService } from '@auth/admin/admin.service';

import { PopupService } from '@shared/popup/popup.service';

@Component({
  selector: 'services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  servicesList: ServiceOffered[];
  formTemplate = [
    { element: 'input',
      label: 'Service name',
      name: 'name',
      rules: 'required',
    },  {
      element: 'textarea',
      label: 'Description',
      name: 'description',
      rules: 'required|min:50',
    },
    { element: 'upload', label: 'Service image (PNG)', name: 'image', rules: 'required' },
    { element: 'upload', label: 'Service icon (SVG)', name: 'icon', rules: 'required' },
    { element: 'button', buttons: [
        { type: 'submit', label: 'Submit', class: 'btn-primary gradient-focus'}
      ]}
  ];

  constructor(
    private offeringService: OfferingService,
    public adminService: AdminService,
    private popupService: PopupService
  ) { }

  ngOnInit() {
    this.servicesList = this.offeringService.getServices();
    this.offeringService.servicesLoaded.subscribe(
      (services: ServiceOffered[]) => {
        this.servicesList = services;
      }
    )
  }

  showPopup() {
    this.popupService.newPopup( 'Create new service', this.formTemplate );
    this.popupService.onSubmit()
      .subscribe((formData)=>this.handleService(formData, 'store'));
  }

  handleService(formData, url) {
    this.popupService.attempt();
    this.offeringService.handleResource(formData, url)
      .subscribe(
        (response) => this.popupService.reply('Success!','New service created successfully!'),
        (error) => this.popupService.reply('Error!', error)
      );
  }

}
