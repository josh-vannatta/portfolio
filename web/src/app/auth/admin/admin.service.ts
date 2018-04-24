import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';

import { GlobalService } from '@shared/global.service';

@Injectable()
export class AdminService {
  editMode: boolean = false;
  isLoggedIn: boolean = false;
  oauthToken: HttpHeaders;

  constructor(
    private globals: GlobalService,
    private http: HttpClient
  ) { }

  private getAccessToken(passport) {
    return this.http.post(
      this.globals.serverUrl + 'oauth/token',
      JSON.stringify(passport), {headers: this.globals.requestHeaders}
    );
  }

  private authenticate(token) {
      this.setCookieToken(token);
      this.oauthToken = new HttpHeaders()
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + token);

      return this.http.get(
        this.globals.serverUrl + 'api/auth/admin', { headers: this.oauthToken }
      ).subscribe(
        (response: any) => this.isLoggedIn = response,
        (error: any) => this.isLoggedIn = false
      );

  }

  login(username: string, password: string) {
    const passport = this.globals.getPassport(username, password);
    return this.getAccessToken(passport).subscribe(
      (response: any) => this.authenticate(response.access_token),
      (error: any) => this.isLoggedIn = false
    );
  }

  logout() {
    this.isLoggedIn = false;
    document.cookie = 'jvn_portfolio=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    return false;
  }

  autoLogin() {
    const token = this.getCookieToken();
    if (token) this.authenticate(token);
  }

  private setCookieToken(token) {
    const name = 'jvn_portfolio';
    const days = 2;
    const expires = new Date();

    expires.setTime(expires.getTime() + (days*24*60*60*1000));
    document.cookie = `${name}=${token};expires=${expires};path=/`;
  }

  private getCookieToken() {
    const name = 'jvn_portfolio=';
    const cookie = decodeURIComponent(document.cookie);
    const cData = cookie.split(';');

    for (let i = 0; i < cData.length; i++){
      while (cData[i].charAt(0) == ' ')
        cData[i] = cData[i].substring(1);
      if (cData[i].indexOf(name) == 0)
        return cData[i].substring(name.length, cData[i].length);
    };

    return false;
  }

}
