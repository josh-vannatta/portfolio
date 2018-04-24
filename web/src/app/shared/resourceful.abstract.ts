import { HttpClient } from '@angular/common/http';
import { GlobalService } from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';

import 'rxjs';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


abstract class Resourceful {
  resourceList: any[];
  resourcesLoaded = new Subject<any[]>();

  constructor(
    private http: HttpClient,
    private globals: GlobalService,
    private adminService: AdminService
  ) { }

  // init() {
  //   this.http.get( this.globals.serverUrl + 'api/projects/all')
  //     .subscribe(
  //       (projects: Project[]) => {
  //         this.projectList = projects;
  //         console.log(projects);
  //         this.projectsLoaded.next(this.projectList.slice());
  //       },
  //       (error: Response) => Observable.throw(error)
  //     )
  // }
  //
  // handleResource(formData, url) {
  //   return this.http.post(
  //     this.globals.serverUrl + `api/projects/${url}`, formData,
  //     { headers: this.adminService.oauthToken }
  //   ).map(
  //     (projects: Project[]) => {
  //       this.projectList = projects;
  //       this.projectsLoaded.next(this.projectList.slice());
  //     }
  //   ).catch((error: Response) => {
  //     return Observable.throw(error);
  //   });
  // }

}
