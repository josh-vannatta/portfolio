import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class GlobalService {
  appName: string = 'JVN Portfolio';
  appAuthor: string = 'Joshua Van Natta';
  serverUrl: string = 'http://127.0.0.1:8000/';
  // serverUrl: string = '/';
  requestHeaders: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private passport =  {
        grant_type: "password",
        client_id: 2,
        client_secret: "cTNF86dUt77vWbGcWgLqboHHBYZvhTDZ05l34phB",
        // client_secret: "LtJRGo9qcJS7KHK2wq1wXz8vkdrA1QtPGbZX4v9f",
        username: null,
        password: null,
        scope: "*"
    }

  getPassport(username: string, password: string ) {
    this.passport.username = username;
    this.passport.password = password;

    return this.passport;
  }

}
