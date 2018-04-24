import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs';

@Injectable()
export class GoogleMapsService {
  constructor(
    private http: HttpClient
  ) { }

  private markers = {
    me: null,
    you: null,
  }

  private geoCoder;
  private apiGeoKey = 'AIzaSyB_ZxBo3mP-cCODikBZVHX5biCP8WTyykw';

  getGeocode(location: string) {
    const locationUri = `?address=${location.replace(' ', '+')}&key=${this.apiGeoKey}`;
    return this.http.get('https://maps.googleapis.com/maps/api/geocode/json' + locationUri);

  }

  private googleMapsLoader;
  private mapElement;
  private selectedStyle;
  private apiMapsKey = 'AIzaSyAAf7OS2oNd6Sc7xB8e_oLjVHRAwGE3hPo';

  generateMap(element: HTMLElement, location: any) {
    this.mapElement = element;
    if (!this.markers.me) this.markers.me = location;
    else this.markers.you = location;

    const mapCenter = Object.assign({}, location);
    mapCenter.lat -= .001;

    this.googleMapsLoader = require('google-maps');
    this.googleMapsLoader.KEY = this.apiMapsKey;

    this.googleMapsLoader.load((google) => {
        let map = this.loadMap(google, mapCenter);
        this.setMarkers(google, map, this.markers.me, `This is me`);
        if (this.markers.you)
          this.setMarkers(google, map, this.markers.you, `This is you`);
    });
  }

  loadMap(google, mapCenter) {
    let map = new google.maps.Map(this.mapElement, {
      center: mapCenter,
      styles: this.dark,
      disableDefaultUI: true,
      zoom: 15
    });

  return map;
  }

  setMarkers(google, map, location, text) {
      new google.maps.Marker({
        position: location,
        map: map,
        title: 'Me',
        label: {
          color: 'white',
          fontWeight: 'bold',
          text: text,
        },
      });
  }

  calcRoute() {
    return new Observable(observer => {

      this.googleMapsLoader.load((google) => {
        let me = this.markers.me;
        let you = this.markers.you;
        let mapCenter = {
          lat: (me.lat + you.lat)/2,
          lng: (me.lng + you.lng)/2,
          zoom: 6
        };

      let map = this.loadMap(google, mapCenter);

       let request = {
         origin: me,
         destination: you,
         travelMode: google.maps.TravelMode.DRIVING
       };

       let directions = new google.maps.DirectionsService();
       let directionsDisplay = new google.maps.DirectionsRenderer();
       directions.route(request, (response, status) => {
          directionsDisplay.setDirections(response);
          directionsDisplay.setMap(map);
          if (response.status === 'OK') {
            let leg = response.routes[0].legs[0];
            directionsDisplay.setMap(map);
            this.setMarkers(google, map, leg.start_location, 'This is me');
            this.setMarkers(google, map, leg.end_location, 'This is you');
            return observer.next({
              data: leg.distance.text.replace(' mi', ''),
              status: response.status
            });
          }
          return observer.next({
            data: this.calcDistanceBetween(me, you),
            status: response.status
          });
        });

      });
    });
  }

  reset() {
    this.markers = {
      me: null,
      you: null,
    };
  }

private calcDistanceBetween(me, you) {
  var R = 6371;
  var dLat = this.deg2rad(you.lat-me.lat);
  var dLon = this.deg2rad(you.lng-me.lng);
  var a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(this.deg2rad(me.lat)) * Math.cos(this.deg2rad(you.lat)) *
    Math.sin(dLon/2) * Math.sin(dLon/2)
  ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return Math.floor(d).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");;
}

private deg2rad(deg) {
  return deg * (Math.PI/180)
}


private dark = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#242f3e"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#263c3f"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#6b9a76"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#38414e"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#212a37"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "visibility": "off",
        "color": "#9ca5b3"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#746855"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#1f2835"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#f3d19c"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#2f3948"
      }
    ]
  },
  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#d59563"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#515c6d"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#17263c"
      }
    ]
  }
]

}
