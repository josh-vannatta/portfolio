import { Component,  OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { FooterComponent } from '@core/footer/footer.component';
import { EditComponent } from '@core/edit/edit.component';
import { AdminService } from '@auth/admin/admin.service';
import { SkillService } from '@shared/skill/skill.service';
import { OfferingService } from '@shared/service/offering.service';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})

export class AppComponent implements OnInit{
  @ViewChild('appContent') appContent: ElementRef;
  @ViewChild('footerComponent') footerComponent: FooterComponent;
  @HostListener('window:resize') onResize() {
    this.setFooterPadding();
  }

  constructor(
    public adminService: AdminService,
    private router: Router,
    private skillService: SkillService,
    private offeringService: OfferingService) {
    this.adminService.autoLogin();
    this.skillService.init();
    this.offeringService.init();
  }

  ngOnInit() {
    this.setFooterPadding();
    this.router.events.subscribe((evt) => {
        if (!(evt instanceof NavigationEnd)) {
            return;
        }
        window.scrollTo(0, 0)
    });
  }

  setFooterPadding() {
    let containerStyle = this.appContent.nativeElement.style;
    let footerElement = this.footerComponent.getElement();
    containerStyle.paddingBottom = footerElement.offsetHeight + 'px';
  }

}
