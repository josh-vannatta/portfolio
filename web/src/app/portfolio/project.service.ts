import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { GlobalService } from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';
import { Project } from './project.model';

@Injectable()
export class ProjectService {
  projectList: Project[] = [];
  projectsLoaded = new Subject<Project[]>();

  constructor(
    private http: HttpClient,
    private globals: GlobalService,
    private adminService: AdminService
  ) { }

  init() {
    this.getResource('all').subscribe(
        (projects: Project[]) => {
          this.projectList = projects;
          this.projectsLoaded.next(this.projectList.slice());
        },
        (error: Response) => Observable.throw(error)
      )
  }

  handleResource(formData, url) {
    return this.http.post(
      this.globals.serverUrl + `api/projects/${url}`, formData,
      { headers: this.adminService.oauthToken }
    ).map(
      (projects: Project[]) => {
        if (typeof projects !== 'boolean') {
          this.projectList = projects;
          this.projectsLoaded.next(this.projectList.slice());
        }
      }
    ).catch((error: Response) => {
      return Observable.throw(error);
    });
  }

  getResource(url) {
    return this.http.get( this.globals.serverUrl + 'api/projects/' + url);
  }

  emptyProject() {
    return new Project(
       '', '',  '', '', [], []
    )
  }

}
