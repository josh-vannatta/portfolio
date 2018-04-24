import { Component, OnInit, Input, ElementRef } from '@angular/core';

import { Project } from '../../project.model';
import { ProjectService } from '../../project.service';
import { PopupService } from '@shared/popup/popup.service';
import { GlobalService } from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';

@Component({
  selector: 'portfolio-item',
  templateUrl: './portfolio-item.component.html',
  styleUrls: ['./portfolio-item.component.scss']
})
export class PortfolioItemComponent implements OnInit {
  hoverStatus: boolean = false;
  serviceDetail: number;
  serviceWidth: number = null;
  formTemplate: any[] = [];
  imagePath: string = 'foo.png';
  @Input() project: Project;
  @Input() serviceList;
  @Input() skillList;

  constructor(
    private globals: GlobalService,
    public adminService: AdminService,
    private popupService: PopupService,
    private projectService: ProjectService,
  ) { this.imagePath = globals.serverUrl + 'storage/projects/'; }

  ngOnInit() {
    this.formTemplate = [
      { element: 'input', type: 'hidden', name: 'id', value: this.project.id},
      { element: 'input', name: 'client', label: 'Project name / client',
        rules: 'required', value: this.project.client },
      { element: 'input', name: 'title', label: 'Project title',
        rules: 'required', value: this.project.title },
      { element: 'input', name: 'site_url', label: 'Site url',
        rules: 'required', value: this.project.site_url },
      { element: 'textarea', name: 'introduction', label: 'Introduction',
        rules: 'required|min:120', value: this.project.introduction },
      { element: 'array', name: 'services', array: this.serviceList,
        label: 'Select a service to offer', chosen: this.project.services},
      { element: 'array', name: 'skills', array: this.skillList,
        label: 'Select a skill used', chosen: this.project.skills},
      { element: 'upload', name: 'image', label: 'Main image'},
      { element: 'button', buttons: [
        { type: 'submit', class: 'gradient-focus', label: 'Submit' }
      ]},
    ]
  }

  showService(index: number) {
    let element = document.getElementById(`service-${index}`);
    this.serviceWidth = element.clientWidth + 40;
    this.serviceDetail = index;
  }

  hideService(index: number) {
    this.serviceWidth = null;
    this.serviceDetail = null;
  }

  showEditPopup() {
    this.popupService.newPopup(
      `Edit service '${this.project.title}'`,
      this.formTemplate
    );
    this.popupService.onSubmit()
      .subscribe((formData: FormData)=>this.updateProject(
        formData, 'update', 'Project successfully updated!'
      ));
  }

  showDestroyPopup() {
    this.popupService.newPopup(
      `Delete service '${this.project.title}'?`,[
        { element: 'button', buttons: [{ type: 'submit', label: 'Confirm', class: 'btn-danger'}] }
      ], 'This will permanently remove this project from your list of projects. You better be sure!'
    );
    this.popupService.onSubmit()
      .subscribe((response)=>this.updateProject(
        {id: this.project.id}, 'destroy', 'Project successfully deleted!'
      ));
  }

  updateProject(formData, url: string, success: string) {
    this.projectService.handleResource(formData, url)
      .subscribe(
        (response) => this.popupService.reply('Success!', success),
        (error) => this.popupService.reply(`Error ${error.status}!`, error.message).returnAfter()
      );
  }

}
