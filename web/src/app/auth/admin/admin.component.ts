import { Component, OnInit } from '@angular/core';

import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  attempting: boolean = false;
  formTemplate = [
    { element: 'input', name: 'email', label: 'My email address', rules: 'required|email', icon: 'envelope' },
    { element: 'input', type: 'password', name: 'password', label: 'My password', rules: 'required', icon: 'lock' },
    { element: 'button', buttons: [
      { type: 'submit', label: 'Login', class: 'btn gradient-focus'}
    ]}
  ]

  constructor(
    public adminService: AdminService
  ) { }

  ngOnInit() {
  }

  attemptLogin(form) {
    this.attempting = true;
    this.adminService.login(form.email, form.password);
  }

  attemptLogout() {
    this.adminService.logout();
  }

}
