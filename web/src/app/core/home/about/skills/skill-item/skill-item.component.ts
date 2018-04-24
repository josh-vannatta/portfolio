import {
  Component, OnInit, OnChanges,
  Input, Output, EventEmitter, ViewChild,
  ElementRef, HostListener, SimpleChange
} from '@angular/core';

import { Skill } from '@shared/skill/skill.model';
import { GlobalService}  from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';
import { SkillService } from '@shared/skill/skill.service';
import { PopupService } from '@shared/popup/popup.service';

@Component({
  selector: 'skill-item',
  templateUrl: './skill-item.component.html',
  styleUrls: ['./skill-item.component.scss']
})
export class SkillItemComponent implements OnInit, OnChanges {
  @Input('skill') skill: Skill;
  @Input('index') index: number;
  @Input('skillSelected') skillSelected: number;
  @Output() onSelect = new EventEmitter<number>();
  @HostListener('window:resize') onResize() {
    if (this.description) this.describeY = this.description.clientHeight;
    if (this.skillSelected !== this.index) this.resetState();
  }

  describeView: string = 'hidden';
  describeY: number = 0;
  @ViewChild('description') descriptionEL: ElementRef;
  description: HTMLElement = null;
  imagePath: string;
  formTemplate;

  constructor(
    private globals: GlobalService,
    public adminService: AdminService,
    private skillService: SkillService,
    private popupService: PopupService,
  ) {}

  ngOnInit() {
    this.imagePath = this.globals.serverUrl + 'storage/skills';
    if (this.skillSelected == this.index) setTimeout(() => {
        this.setState(this.descriptionEL.nativeElement.clientHeight);
    }, 100);
    this.formTemplate = [
      { element: 'input', label: 'Skill name', name: 'name',
        rules: 'required', value: this.skill.name,
      }, {
        element: 'input', label: 'Time spent (in years)', name: 'years',
        rules: 'required|decimal', type: 'number', value: this.skill.years,
      }, {
        element: 'textarea', label: 'Description', name: 'description',
        rules: 'required|min:80', value: this.skill.description,
      },
      { element: 'upload', label: 'Skill icon (SVG)', name: 'icon' },
      { element: 'button', buttons: [
        { type: 'submit', label: 'Submit', class: 'btn-primary gradient-focus'}
      ]}
    ];
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (this.skillSelected !== this.index) this.resetState();
  }

  showDescription(element: HTMLElement) {
    this.onSelect.emit(this.index);
    this.description = element;
    this.setState(element.clientHeight);
  }

  setState(height: number) {
    if (this.describeView == 'hidden') {
      let delay = this.skillSelected !== null ? 300 : 0;
      setTimeout(()=>{
        this.describeView = 'visible';
        this.describeY = height;
      }, delay);
      return;
    }
    this.resetState();
    this.onSelect.emit(null);
  }

  resetState() {
    this.describeView = 'hidden';
    this.describeY = 0;
  }

  showEditPopup() {
    this.popupService.newPopup(
      `Edit skill '${this.skill.name}'`, this.formTemplate
    );
    this.popupService.onSubmit()
      .subscribe((formData)=>this.handleSkill(formData, 'update'));
  }

  showDestroyPopup() {
    this.popupService.newPopup(
        `Delete skill '${this.skill.name}'?`, [
          { element: 'button', buttons: [{ type: 'submit', label: 'Confirm', class: 'btn-danger'}] }
        ], 'This will permanently remove this skill from your list of skills. There is no going back from here!'
    );
    this.popupService.onSubmit()
      .subscribe((formData)=>this.handleSkill(formData, 'destroy'));
  }

  handleSkill(formData, url) {
    this.popupService.attempt();
    formData.append('id', `${this.skill.id}`);
    this.skillService.handleResource(formData, url)
      .subscribe(
        (response)=> this.popupService.reply('Success!', "Skill successfully updated."),
        (error) => this.popupService.reply('Error!', error)
      );
  }

}
