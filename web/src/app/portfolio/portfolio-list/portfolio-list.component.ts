import { Component, OnInit } from '@angular/core';

import { AdminService } from '@auth/admin/admin.service';
import { PopupService } from '@shared/popup/popup.service';
import { SkillService } from '@shared/skill/skill.service';
import { Skill } from '@shared/skill/skill.model';
import { OfferingService } from '@shared/service/offering.service';
import { ServiceOffered } from '@shared/service/service-offered.model';
import { ProjectService } from '../project.service';
import { Project } from '../project.model';

@Component({
  selector: 'portfolio-list',
  templateUrl: './portfolio-list.component.html',
  styleUrls: ['./portfolio-list.component.scss']
})
export class PortfolioListComponent implements OnInit {
  skillList: Skill[];
  serviceList: ServiceOffered[];
  projectList: Project[];
  formTemplate = [
    { element: 'input', name: 'client', label: 'Project name / client', rules: 'required'},
    { element: 'input', name: 'title', label: 'Project title', rules: 'required'},
    { element: 'input', name: 'site_url', label: 'Site url', rules: 'required|url'},
    { element: 'textarea', name: 'introduction', label: 'Introduction', rules: 'required|min:120'},
    { element: 'array', name: 'services', array: this.serviceList, label: 'Select a service to offer'},
    { element: 'array', name: 'skills', array: this.skillList, label: 'Select a skill used'},
    { element: 'upload', name: 'image', label: 'Main image', rules: 'required'},
    { element: 'button', buttons: [
      { type: 'submit', class: 'gradient-focus', label: 'Submit' }
    ]},
  ]

  constructor(
    public adminService: AdminService,
    private popupService: PopupService,
    private skillService: SkillService,
    private offeringService: OfferingService,
    private projectService: ProjectService
  ) { }

  ngOnInit() {
    this.serviceList = this.offeringService.getServices();
    this.skillList = this.skillService.getSkills();
    this.offeringService.servicesLoaded.subscribe(
      (services: ServiceOffered[]) => {
        this.formTemplate[4]['array'] = services;
        this.serviceList = services
      }
    );
    this.skillService.skillsLoaded.subscribe(
      (skills: Skill[]) => {
        this.formTemplate[5]['array'] = skills;
        this.skillList = skills
      }
    );
    this.projectService.init();
    this.projectService.projectsLoaded.subscribe(
      (projects: Project[]) => this.projectList = projects
    );

  }

  newProjectPopup() {
    this.popupService.newPopup(
      'New portfolio project',
      this.formTemplate,
    );
    this.popupService.onSubmit()
      .subscribe((formData: FormData) => this.createProject(formData));
  }

  createProject(formData: FormData) {
    this.projectService.handleResource(formData, 'store')
      .subscribe(
        (response) => this.popupService.reply('Success!', 'New project successfully created!'),
        (error) => this.popupService.reply(`Error ${error.status}!`, error.message)
      )
  }

}
