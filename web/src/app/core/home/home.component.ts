import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GlobalService } from '@shared/global.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  ngOnInit() {

  }

}
