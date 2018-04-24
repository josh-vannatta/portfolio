import { Component, OnInit } from '@angular/core';

import { SkillService } from '@shared/skill/skill.service';
import { Skill } from '@shared/skill/skill.model';

import { AdminService } from '@auth/admin/admin.service';
import { PopupService } from '@shared/popup/popup.service';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skillList: Skill[];
  formTemplate = [
    { element: 'input',
      label: 'Skill name',
      name: 'name',
      rules: 'required',
    }, {
      element: 'input',
      label: 'Time spent (in years)',
      name: 'years',
      rules: 'required|decimal',
      type: 'number',
    }, {
      element: 'textarea',
      label: 'Description',
      name: 'description',
      rules: 'required|min:80',
    },
    { element: 'upload', label: 'Skill icon (SVG)', name: 'icon', rules: 'required' },
    { element: 'button', buttons: [
        { type: 'submit', label: 'Submit', class: 'btn-primary gradient-focus'}
      ]}
  ];
  selected: number = 0;

  constructor(
    private skillService: SkillService,
    public adminService: AdminService,
    private popupService: PopupService,
  ) { }

  ngOnInit() {
    this.skillList = this.skillService.getSkills();
    this.skillService.skillsLoaded
        .subscribe(
          (skills: Skill[]) => {
            this.skillList = skills;
          }
        );
  }

  skillSelected(selectedItem: number) {
    this.selected = selectedItem;
  }

  showPopup() {
    this.popupService.newPopup('Create new skill', this.formTemplate);
    this.popupService.onSubmit()
      .subscribe((formData)=>this.handleSkill(formData));
  }

  handleSkill(formData) {
    this.popupService.attempt();
    this.skillService.handleResource(formData, 'store')
      .subscribe(
        (response) => this.popupService.reply('Success!','New skill created successfully!'),
        (error) => this.popupService.reply('Error!', error)
      );
  }
}
