import { Component, OnInit, Output, ViewChild, HostListener  } from '@angular/core';
import { NavbarComponent } from 'angular-bootstrap-md/navbars/navbar.component';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { GlobalService } from '@shared/global.service';

@Component({
  selector: 'core-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @ViewChild('navbar') navbar: NavbarComponent;
  @HostListener('window:scroll',) onScroll(event) {
    this.setHeaderState();
    this.pageYOffset = window.pageYOffset;
  }
  @HostListener('window:resize') onResize() {
    this.setMobileState();
    this.setHeaderState();
  }
  pageYOffset: number = 0;
  navbarElem: any;
  hamburgerElem: any = null;
  hamburgerTemplate: string = `
    <button class="hamburger hamburger--emphatic-r" type="button">
      <span class="hamburger-box">
        <span class="hamburger-inner"></span>
      </span>
    </button>
  `;
  linkStatus = {
    'home': false,
    'portfolio': false,
    'workshop': false,
    'contact': false,
  }

  route: string;
  constructor(location: Location, router: Router) {
    router.events.subscribe((val) => {
        this.route = location.path();
    });
  }

  ngOnInit() {
    this.navbarElem = this.navbar.navbar.nativeElement;
    this.navbarElem.childNodes[1]
      .insertAdjacentHTML('beforeend', this.hamburgerTemplate);
    setTimeout(()=>this.setHeaderState(), 0)

    this.navbarElem.addEventListener('click', ()=>{
      this.hamburgerElem = this.navbarElem.childNodes[1].children[3];
      this.setMobileState();
      this.setHeaderState();
    })
  }

  selectLink(link) {
    this.linkStatus[link] = true;
    setTimeout(() => {
      this.linkStatus[link] = null;
    }, 500);
    setTimeout(() => {
      this.linkStatus[link] = false;
    }, 800);
  }

  setHeaderState() {
    if (this.route != '' && this.route != '/contact' && window.pageYOffset < 200){
      this.navbarElem.style.top = '0px';
      this.navbarElem.classList.add('show-background');
      return;
    }

    if (window.pageYOffset >= 200 || this.navbar.shown) {
      this.navbarElem.classList.add('show-background');
      if (this.navbar.shown != true)
        this.navbarElem.style.top = '-80px';
      if (window.pageYOffset < this.pageYOffset)
        this.navbarElem.style.top = '0px';
        return;
    }
    this.navbarElem.style.top = '0px';
    this.navbarElem.classList.remove('show-background');
  }

  setMobileState() {
    if (this.hamburgerElem === null) return;

    if (window.innerWidth >= 768)
      this.hamburgerElem.classList.remove('is-active');

    if (this.navbar.shown == true) {
      this.hamburgerElem.classList.add('is-active');
      this.navbarElem.classList.add('show-menu');
      return;
    }
    this.hamburgerElem.classList.remove('is-active');
    this.navbarElem.classList.remove('show-menu');
  }

}
