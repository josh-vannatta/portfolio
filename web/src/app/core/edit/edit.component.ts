import { Component, OnInit } from '@angular/core';

import { AdminService } from '@auth/admin/admin.service';

@Component({
  selector: 'admin-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  showEditMenu: boolean = false;

  constructor(
    public adminService: AdminService
  ) { }

  ngOnInit() {
  }

  checkToggler(node) {
    this.adminService.editMode = node.checked;
  }

}
