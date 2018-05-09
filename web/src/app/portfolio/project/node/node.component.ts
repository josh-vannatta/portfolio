import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

import { ProjectNode } from '../../project-node.model';
import { GlobalService } from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';
import { PopupService } from '@shared/popup/popup.service';
import { ProjectNodeService } from '../../project-node.service';

@Component({
  selector: 'project-node',
  templateUrl: './node.component.html',
  styleUrls: ['./node.component.scss']
})
export class ProjectNodeComponent implements OnInit {
  codeDisplay: number = 0;
  codeStatus: string = '< code-sample />';
  imgDisplay: string = 'unset';
  imagePath: string;
  imageView: boolean = true;
  @Input('node') node: ProjectNode;
  @ViewChild('image') image: ElementRef;
  parsedCode: any[] = [];
  nodeForm: any[];
  codeLanguage: string = '';

  constructor(
    private globals : GlobalService,
    public adminService: AdminService,
    private nodeService: ProjectNodeService,
    private popupService: PopupService
  ) { }

  ngOnInit() {
    this.imagePath = this.globals.serverUrl + 'storage/';
    this.nodeForm = [
        { element: 'input', type: 'hidden', name: 'id', label: '', value: this.node.id },
        { element: 'input', type: 'hidden', name: 'project_id', label: '', value: this.node.project_id },
        { element: 'input', type: 'hidden', name: 'type', label: '', value: this.node.type },
        { element: 'input', name: 'title', label: 'Title', rules: 'required', value: this.node.title},
        { element: 'textarea', name: 'content', label: 'Content', rules: 'required|min:80', value: this.node.content},
        { element: 'upload', name: 'image', label: 'Overview image (JPG)'},
        { element: 'upload', name: 'code', label: 'Code file (TXT)'},
        { element: 'button', buttons: [
          { type: 'submit', class: 'gradient-focus', label: 'Submit' }
        ]}
      ];
    if (this.node.code !== 0){
      let Prism = require('prismjs');
      let loadLanguages = require('prismjs/components/index.js');
      let language = /##([^}]+)##/g.exec(this.node.code);
      this.codeLanguage = language[1];
      let code = this.node.code.replace(language[0], '');
      loadLanguages([language[1]]);
      this.parsedCode = Prism.highlight(code, Prism.languages[language[1]], language[1]);
    }
  }

  toggleCode(codeElement: HTMLElement) {
    this.codeDisplay = this.codeDisplay == 0 ? codeElement.clientHeight : 0;
    this.codeStatus = this.codeStatus == '< code-sample />' ? 'project image' : '< code-sample />' ;
    this.imgDisplay = this.codeDisplay == 0 ?
          this.image.nativeElement.clientHeight + 'px' : 0 + 'px';
  }

  showEditPopup() {
    this.popupService.newPopup(`Edit project node '${this.node.title}'`, this.nodeForm);
    this.popupService.onSubmit()
      .subscribe((formData: FormData)=>this.updateProject(formData, 'update', `${this.node.title} successfully updated!`));
  }

  showDestroyPopup() {
    this.popupService.newPopup(
        `Delete project node '${this.node.title}'?`, [
          { element: 'button', buttons: [{ type: 'submit', label: 'Confirm', class: 'btn-danger'}] }
        ], `This will permanently remove ${this.node.type} from this project. This will be permanent!`
    );
    this.popupService.onSubmit()
      .subscribe((formData: FormData)=>this.updateProject(
        { id: this.node.id }, 'destroy', `${this.node.title} successfully removed!`)
      );
  }

  updateProject(formData, url: string, success: string) {
    this.nodeService.handleResource(formData, url)
      .subscribe(
        (response) => this.popupService.reply('Success!', success),
        (error) => this.popupService.reply(`Error ${error.status}!`, error.message).returnAfter()
      );
  }

}
