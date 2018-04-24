import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ServiceOffered } from './service-offered.model';
import { GlobalService } from '@shared/global.service';
import { AdminService } from '@auth/admin/admin.service';

import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class OfferingService {
  servicesLoaded = new Subject<ServiceOffered[]>();
  servicesOffered: ServiceOffered[] = [];

  constructor(
    private http: HttpClient,
    private adminService: AdminService,
    private globals: GlobalService ) { }

  init() {
    this.getResource('all').subscribe(
      (servicesOffered: ServiceOffered[]) => {
        this.servicesOffered = servicesOffered;
        this.servicesLoaded.next(this.servicesOffered.slice());
      },
      (error: Response) => Observable.throw(error)
    );
  }

  getServices() {
    return this.servicesOffered.slice();
  }

  handleResource(formData, url) {
    return this.http.post(
      this.globals.serverUrl + `api/services/${url}`, formData,
      { headers: this.adminService.oauthToken }
    ).map(
      (servicesOffered: ServiceOffered[]) => {
        this.servicesOffered = servicesOffered
        this.servicesLoaded.next(this.servicesOffered.slice());
      }
    ).catch((error: Response) => {
      return Observable.throw(error);
    });
  }

  getResource(url) {
    return this.http.get( this.globals.serverUrl + 'api/services/' + url);
  }

}
