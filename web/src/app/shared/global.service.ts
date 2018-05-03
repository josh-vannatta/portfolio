import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';

@Injectable()
export class GlobalService {
  appName: string = 'JVN Portfolio';
  appAuthor: string = 'Joshua Van Natta';
  // serverUrl: string = 'http://127.0.0.1:8000/'; // local
  serverUrl: string = '/'; // web
  requestHeaders: HttpHeaders = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
  private passport =  {
        grant_type: "password",
        client_id: 2,
        // client_secret: "cTNF86dUt77vWbGcWgLqboHHBYZvhTDZ05l34phB", // local
        client_secret: "LtJRGo9qcJS7KHK2wq1wXz8vkdrA1QtPGbZX4v9f", // web
        username: null,
        password: null,
        scope: "*"
    }

  getPassport(username: string, password: string ) {
    this.passport.username = username;
    this.passport.password = password;

    return this.passport;
  }

  /*

  The problem at the moment is that I need content for this section of my site and I need it finished today.
  I don't know what employers would like / not like and my intuition is that it should be genuine and infornmative.
  How do I make these descriptions informative and geniune? How do I write something worth reading that is about my experience and ability?

  EXPERIENCE & ABILITY is the focus

  I have experience building / doing ____ with ____.
  I am interested in ____ using ____.
  I have used ____ libraries / plugins for ____.

  How can I manipulate my employers to get what I want?

  */

}
