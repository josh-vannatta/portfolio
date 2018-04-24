import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GoogleMapsService } from '@shared/google-maps/google-maps.service';
import { PopupService } from '@shared/popup/popup.service';

import { GlobalService } from '@shared/global.service';

@Component({
  selector: 'contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  formTemplate = [
    {
      element: 'input', label: 'Your name', name: 'sender',
      rules: 'required', icon: 'child', class: 'col-lg-6'
    }, {
      element: 'input', label: 'Your email', name: 'email',
      rules: 'required|email', icon: 'envelope', class: 'col-lg-6'
    }, {
      element: 'input', label: 'Subject', name: 'subject',
      rules: 'required', icon: 'tag'
    }, {
      element: 'textarea', label: 'Your message', name: 'message',
      rules: 'required', icon: 'pencil', rows: "8"
    }, {
      element: 'button', buttons: [
        { type: 'submit', label: 'SEND MESSAGE', class: 'contact-submit btn-primary gradient-focus', icon: 'paper-plane' }
      ]
    }
  ];
  socialLinks = [
    { href: 'https://www.facebook.com/', icon: 'fa-facebook' },
    { href: 'https://www.linkdin.com/', icon: 'fa-linkedin' },
    { href: 'https://www.github.com/', icon: 'fa-github' },
    { href: 'https://www.stack-overflow.com/', icon: 'fa-stack-overflow' },
  ];
  @ViewChild('overlay') overlay: ElementRef;
  @ViewChild('mapElement') mapElement: ElementRef;
  myLocation = {lat: 39.737, lng: -104.983};
  formReset: boolean = false;
  heroState: boolean = false;
  searchLocation: string = '';
  searchResponse: string = '';
  searchResults = null;
  searchStatus: boolean = null;
  searchTooBig: boolean = false;

  constructor(
    private mapService: GoogleMapsService,
    private popupService: PopupService,
    private globals: GlobalService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    setTimeout(()=>{
      this.overlay.nativeElement.style.opacity = '.6';
    }, 300);
    this.mapService.reset();
    this.mapService.generateMap(this.mapElement.nativeElement, this.myLocation);
  }

  getGeocode() {
    this.mapService.getGeocode(this.searchLocation)
      .subscribe(
        (response:any) =>{
          if (response.status == "OK") {
            let geoLocation = response.results[0].geometry.location;
            this.mapService.generateMap(this.mapElement.nativeElement, geoLocation);
            this.searchResponse = 'Now let\s see how far we are from each other';
            this.searchStatus = true;
            return;
          }
          this.searchStatus = false;
          this.searchResponse = this.getErrorResponse();
        },
        error=>{
          this.searchStatus = false;
          this.searchResponse = this.getErrorResponse();
        }
      );
  }

  showDirections() {
    this.mapService.calcRoute().subscribe(
      (response: any)=>{
        this.searchTooBig = response.status !== 'OK';
        this.searchResponse = response.data;
        let miles = response.data.replace(',', '');
        this.searchResults = [
          { time: Math.floor(+miles / 60 * 10) / 10, method: 'car', },
          { time: Math.floor(+miles / 16 * 10) / 10, method: 'bicycle', },
          { time: Math.floor(+miles / 4 * 10) / 10, method: 'male', }
        ];
      },
      response=>this.searchTooBig = false,
    );
  }

  resetSearch() {
    this.heroState = !this.heroState;
    this.searchTooBig = false;
    this.searchResponse = '';
    this.searchLocation = '';
    this.searchStatus = null;
    this.searchResults = null;
    this.mapService.reset();
    this.mapService.generateMap(this.mapElement.nativeElement, this.myLocation);
  }

  getErrorResponse() {
    const responses = [
      "Uh oh, try again", "Um, I'm pretty sure that's not a place.",
      "You may want to check your spelling",
      "That doesn't make any sense... Are you ok?",
      "Hmmm, you seem to have broken google maps",
      "Yeah... you're making that one up",
      "0 points in accuracy, but +10 for creativity",
      "No no no, that's not how you spell it.",
      "No results for " + this.searchLocation, "Huh?", "Come again?",
      "Oh, sure! I know " + this.searchLocation + ".Wait, no..."
    ]
    return responses[Math.floor(Math.random() * responses.length)];
  }

  getBestDuration(time) {
    if (time > 399) return tens(365) + ' years';
    if (time > 365) return tens(365)  + ' year';
    if (time > 33) return tens(31) + ' months';
    if (time > 31) return tens(31)  + ' month';
    if (time == 1) return time + ' day';
    return time + ' days';

    function tens(duration) {
      return Math.floor(time/duration * 10) / 10;
    }
  }

  sendContactEmail(formData) {
    this.popupService.attempt();
    this.popupService.canClose = false;
    this.popupService.newPopup(
      'Working on it...', [], 'Give me just a moment while I send your email.'
    );
    this.http.post(this.globals.serverUrl + 'api/contact', formData)
      .subscribe(
        (response) => {
          this.formReset = true;
          this.popupService.reply(
            'Thanks for your message!',
            `I\'ll get back to you as soon as possible.
            In the meantime, check out more of my work at
            <a href="${this.socialLinks[2]}" target="_blank"
              class="floating-link">github</a>.`
          );
        },
        (error) => {
            this.popupService.reply(
              'Drats, I couldn\'t send your message!',
              `It looks like I encoured an error. Feel free to keep trying or reach me directly at josh@joshuavn.dev`
            )
            this.formReset = false;
        }
      );
  }

}
