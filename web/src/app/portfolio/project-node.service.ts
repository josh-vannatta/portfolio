import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { GlobalService } from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';
import { ProjectNode } from './project-node.model';

@Injectable()
export class ProjectNodeService {
  nodeList: ProjectNode[] = [];
  nodesLoaded = new Subject<ProjectNode[]>();

  constructor(
    private http: HttpClient,
    private globals: GlobalService,
    private adminService: AdminService
  ) { }

  getAllNodes(id: string) {
    return this.getResource('all/' + id).map(
      (nodes: ProjectNode[]) => {
          this.nodeList = nodes;
          this.nodesLoaded.next(this.nodeList.slice());
          return nodes;
      }
    ).catch((error: Response) => {
      return Observable.throw(error);
    });
  }

  handleResource(formData, url) {
    return this.http.post(
      this.globals.serverUrl + `api/projects/nodes/${url}`, formData,
      { headers: this.adminService.oauthToken }
    ).map(
      (nodes: ProjectNode[]) => {
        if (typeof nodes !== 'boolean') {
          this.nodeList = nodes;
          this.nodesLoaded.next(this.nodeList.slice());
        }
      }
    ).catch((error: Response) => {
      return Observable.throw(error);
    });
  }

  getResource(url) {
    return this.http.get( this.globals.serverUrl + 'api/projects/nodes/' + url);
  }

}
