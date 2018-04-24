import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { GlobalService } from '@shared/global.service';

@Component({
  selector: 'core-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  copyrightYear: number = new Date().getFullYear();
  @ViewChild('appFooter') footerElement: ElementRef;
  appName: string;
  appAuthor: string;

  constructor( protected globals: GlobalService ) {
    this.appName = globals.appName;
    this.appAuthor = globals.appAuthor;
  }

  ngOnInit() {
  }

  getElement() {
    return this.footerElement.nativeElement;
  }

}
