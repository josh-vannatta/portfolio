import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { GlobalService } from '@shared/global.service';

@Injectable()
export class AuthService {
  token: string;
  loggedIn: boolean = false;

  constructor(
      private http: HttpClient,
      private globals: GlobalService,
      private router: Router ) { }

  signupUser(email: string, password: string) {
    this.http.post(
      this.globals.serverUrl + 'signup',
      {email: email, password: password},
      {headers: this.globals.requestHeaders})
      .subscribe((token: string)=> {
          this.signinUser(email, password);
      });
  }

  signinUser(email: string, password: string) {
    this.http.post(
      this.globals.serverUrl + 'login',
      {email: email, password: password},
      {headers: this.globals.requestHeaders})
      .subscribe((token: string)=> {
          this.token = token;
          this.router.navigate(['/']);
      });
  }

  logoutUser() {
    this.token = null;
    return false;
  }

  getToken(token) {
    let params = new HttpParams().set('auth', token);
    this.http.get(
        this.globals.serverUrl + 'api/token',
        { params: params}
      )
      .subscribe(
        (token: string) => this.token = token,
        (error: any) => console.log(error)
      );
    return this.token;
  }

  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
        resolve(this.loggedIn = true);
    });
    return promise;
  }

}
