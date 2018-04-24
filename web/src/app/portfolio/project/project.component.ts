import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { Project } from '../project.model';
import { ProjectService } from '../project.service';
import { Subject } from 'rxjs/Subject';

import { GlobalService } from '@shared/global.service';
import { PopupService } from '@shared/popup/popup.service';
import { AdminService } from '@auth/admin/admin.service';
import { ProjectNodeService } from '../project-node.service';
import { ProjectNode } from '../project-node.model';

@Component({
  selector: 'project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  client: string;
  imagePath: string;
  project: Project = this.projectService.emptyProject();
  overview = null;
  conclusion = null;
  nodeList: ProjectNode[];
  nodeForm = [
    { element: 'input', type: 'hidden', name: 'project_id', label: '', value: '' },
    { element: 'input', type: 'hidden', name: 'type', label: '' },
    { element: 'input', name: 'title', label: 'Title', rules: 'required'},
    { element: 'textarea', name: 'content', label: 'Content', rules: 'required|min:80'},
    { element: 'upload', name: 'image', label: 'Image (JPG)', rules: 'required'},
    { element: 'upload', name: 'code', label: 'Code file (TXT)'},
    { element: 'button', buttons: [
      { type: 'submit', class: 'gradient-focus', label: 'Submit' }
    ]}
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private globals: GlobalService,
    public adminService: AdminService,
    private popupService: PopupService,
    private nodeService: ProjectNodeService
  ) { }

  ngOnInit() {
    this.imagePath = this.globals.serverUrl + 'storage/';
    this.route.params.subscribe((params: Params)=>{
      this.client = params['client'].replace('-', ' ');
      this.projectService.getResource('show/' + this.client)
        .subscribe(
          (project: Project) => {
            this.nodeForm[0]['value'] = project.id;
            this.project = project;
            this.getProjectNodes(project.id);
          },
          (error: Response ) => this.router.navigateByUrl('error-404')
        );
    });
  }

  getProjectNodes(id) {
    this.nodeService.getAllNodes(id).subscribe(
      (nodes: ProjectNode[]) => this.refreshNodes(nodes)
    );
    this.nodeService.nodesLoaded.subscribe(
      (nodes: ProjectNode[]) => this.refreshNodes(nodes)
    );
  }

  refreshNodes(nodes) {
    this.nodeList = nodes;
    this.nodeList.forEach((node, index) =>{
      if (node.type == 'overview'){
        this.nodeList.splice(index, 1);
        this.overview = node;
      }
      if (node.type == 'conclusion'){
          this.nodeList.splice(index, 1);
          this.conclusion = node;
      }
    })
  }

  showIconPopup() {
    this.popupService.newPopup('Change project icon', [
      { element: 'input', type: 'hidden', name: 'id', label: '', value: this.project.id},
      { element: 'upload', name: 'icon', label: 'Icon file (SVG)', rules: 'required'},
      { element: 'button', buttons: [
        { type: 'submit', class: 'gradient-focus', label: 'Submit' }
      ]}
    ]);
    this.popupService.onSubmit().subscribe(
      (formData: FormData) => this.handleProject(formData, 'edit', 'Icon successfully changed!')
    );
  }

  handleProject(formData, url: string, success: string) {
    this.projectService.handleResource(formData, url)
      .subscribe(
        (response) => this.popupService.reply('Success!', success),
        (error) => this.popupService.reply(`Error ${error.status}!`, error.message).returnAfter()
      );
  }

  showOverviewPopup() {
    this.nodeForm[1]['value'] = 'overview';
    this.nodeForm[2]['value'] = 'Project overview';
    this.popupService.newPopup('Add project overview', this.nodeForm);
    this.popupService.onSubmit()
      .subscribe((formData: FormData)=>this.handleNode(formData, 'store', 'Project overview created!'));
  }

  showFeaturePopup() {
    this.nodeForm[1]['value'] = 'feature';
    this.nodeForm[2]['value'] = '';
    this.popupService.newPopup('Add new feature', this.nodeForm);
    this.popupService.onSubmit()
      .subscribe((formData: FormData)=>this.handleNode(formData, 'store', 'Project feature created!'));
  }

  showConclusionPopup() {
    this.nodeForm[1]['value'] = 'conclusion';
    this.nodeForm[2]['value'] = 'Conclusion';
    this.popupService.newPopup('Add project conclusion', this.nodeForm);
    this.popupService.onSubmit()
      .subscribe((formData: FormData)=>this.handleNode(formData, 'store', 'Project conclusion added!'));
  }

  handleNode(formData, url: string, success: string) {
    this.nodeService.handleResource(formData, url)
      .subscribe(
        (response) => this.popupService.reply('Success!', success),
        (error) => this.popupService.reply(`Error ${error.status}!`, error.message).returnAfter()
      );
  }

}
