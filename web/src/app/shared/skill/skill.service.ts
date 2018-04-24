import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Skill } from './skill.model';

import { GlobalService } from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SkillService {
  skillList: Skill[] = [];
  skillsLoaded = new Subject<Skill[]>();

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private globals: GlobalService ) { }

  init() {
    this.getResource('all').subscribe(
        (skillList: Skill[]) => {
          this.skillList = skillList;
          this.skillsLoaded.next(this.skillList.slice());
        },
        (error: Response) => Observable.throw(error)
      )
  }

  getSkills() {
    return this.skillList.slice();
  }

  handleResource(formData, url) {
    return this.http.post(
      this.globals.serverUrl + `api/skills/${url}`, formData,
      { headers: this.adminService.oauthToken }
    ).map(
      (skillList: Skill[]) => {
        this.skillList = skillList;
        this.skillsLoaded.next(this.skillList.slice());
      }
    ).catch((error: Response) => {
      return Observable.throw(error);
    });
  }

  getResource(url) {
    return this.http.get( this.globals.serverUrl + 'api/skills/' + url);
  }

}
