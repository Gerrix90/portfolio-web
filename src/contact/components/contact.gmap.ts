'use strict';
import Animation                      = google.maps.Animation;
import event                          = google.maps.event;
import InfoWindow                     = google.maps.InfoWindow;
import LatLng                         = google.maps.LatLng;
import Map                            = google.maps.Map;
import Marker                         = google.maps.Marker;
import Polyline                       = google.maps.Polyline;
import {Component, View, OnInit}      from 'angular2/core';
import {Http, HTTP_PROVIDERS}         from 'angular2/http';
import {MAP_OPTIONS}                  from '../../shared/models/contact/map.config';
import {CITIES}                       from '../../shared/models/contact/cities';
import {AIRPORTS}                     from '../../shared/models/contact/airports';
import {JOURNEYS, UPCOMING_JOURNEYS}  from '../../shared/models/contact/journeys';
import * as p                         from '../../shared/models/contact/points';
import {City}                         from '../../shared/models/contact/definitions/city';
import {Airport}                      from '../../shared/models/contact/definitions/airport';
import {elementInViewport}            from '../../shared/common/common';

@Component({
  selector: 'googlemap',
  providers: [Http, HTTP_PROVIDERS]
})
@View({
  templateUrl: './contact/components/contact.gmap.html',
  styleUrls: ['./contact/components/contact.gmap.css']
})
export class ContactMapComponent implements OnInit {
  public map:Map;
  private _timeoutScroll:any;
  private _timeoutMarkerBounce:any;
  private _tilesLoadedEvent:any;
  private _tilesLoaded:boolean;
  private _mapMarkersDrawn:boolean;
  private _infoWindow:InfoWindow;
  private _journeyLines:Array<Polyline>;
  private _upcomingJourneyLines:Array<Polyline>;
  private _cityMarkers:Array<Marker>;
  private _airportMarkerDropWait:number;
  private _journeyLineDrawWait:number;
  private _additionalMarkerWait:number;
  private _markerWait:number;

  constructor() {
    this._tilesLoaded = false;
    this._mapMarkersDrawn = false;
    this._infoWindow = new InfoWindow();
    this._journeyLines = [];
    this._upcomingJourneyLines = [];
    this._cityMarkers = [];
    this._airportMarkerDropWait = 0;
    this._journeyLineDrawWait = 0;
    this._additionalMarkerWait = 0;
  }

  ngOnInit() {
    this.initializeMap();
    this.initScrollListener();
    this.initClickListener();
  }

  initializeMap() {
    const MAP_MAX_MOBILE_ZOOM_ZERO:number = 768;
    const MAP_MAX_TABLET_ZOOM_ONE:number = 1024;
    (($) => {
      _.delay(() => {
        let mapOptions = _.clone(MAP_OPTIONS);
        if ($(window).width() < MAP_MAX_MOBILE_ZOOM_ZERO) {
          mapOptions.zoom = 0;
          mapOptions.minZoom = 0;
        } else if ($(window).width() < MAP_MAX_TABLET_ZOOM_ONE) {
          mapOptions.zoom = 1;
          mapOptions.minZoom = 1;
        }
        this.map = new Map(document.getElementById('map-canvas'), mapOptions);
        _.each(JOURNEYS, (journey:Array<Airport>, index:number) => {
          this._journeyLines[index] = new Polyline({
            strokeOpacity: 0.5,
            strokeColor: '#1b1f29',
            strokeWeight: 2,
            geodesic: true,
            map: this.map
          });
        });
        _.each(UPCOMING_JOURNEYS, (upcomingJourney:Array<Airport>, index:number) => {
          this._upcomingJourneyLines[index] = new Polyline({
            strokeOpacity: 0,
            icons: [{
              icon: {
                path: 'M 0, -1 0,1',
                strokeOpacity: 0.5,
                strokeWeight: 2
              },
              offset: '0',
              repeat: '12px'
            }],
            geodesic: true,
            map: this.map
          });
        });
        this._tilesLoadedEvent = event.addListener(this.map, 'tilesloaded', () => {
          event.removeListener(this._tilesLoadedEvent);
          this._tilesLoaded = true;
          this.dropMarkers();
        });
      }, 250);
    })(jQuery);
  }

  initScrollListener() {
    (($) => {
      $(document).on('scroll', () => {
        // wait half a second for scroll to stop
        if (this._timeoutScroll) {
          clearTimeout(this._timeoutScroll);
        }
        this._timeoutScroll = _.delay(() => {
          if (!this._mapMarkersDrawn) {
            this.dropMarkers(750);
          }
        }, 500);
      });
    })(jQuery);
  }

  initClickListener() {
    (($) => {
      $('#js_click_address').click((e) => {
        e.preventDefault();
        let cityMarker = this._cityMarkers[this._cityMarkers.length - 1];
        if (cityMarker && cityMarker.getTitle()) {
          this.toggleBounce(cityMarker, cityMarker.getTitle());
        }
      });
    })(jQuery);
  }

  dropMarkers(wait:number = 1500) {
    this._markerWait = wait;
    (($) => {
      $('.js_trigger_map_marker').each((index:number, val:string) => {
        if (!this._mapMarkersDrawn && elementInViewport($, $(val))) {
          if (this._tilesLoaded) {
            this._mapMarkersDrawn = true;
            _.delay(() => {
              _.each(AIRPORTS, (airport:Airport) => {
                this._airportMarkerDropWait++;
                _.delay(() => {
                  let marker = new Marker({
                    position: new LatLng(airport.loc.lat, airport.loc.lng),
                    map: this.map,
                    draggable: false,
                    animation: Animation.DROP,
                    zIndex: 100,
                    title: airport.iataCode + ' // ' + airport.name,
                    icon: {
                      url: 'assets/images/markerairport.png',
                      size: p.AIRPORT_SIZE
                    }
                  });
                  event.addListener(marker, 'click', () => {
                    this.toggleBounce(marker, airport.iataCode, airport.name);
                  });
                }, this._airportMarkerDropWait * 135);
              });
              _.each(JOURNEYS, (journey:Array<Airport>, index:number) => {
                let journeyLine:Polyline = this._journeyLines[index];
                _.each(journey, (leg:Airport) => {
                  this._journeyLineDrawWait++;
                  _.delay(() => {
                    journeyLine.getPath().push(
                      new LatLng(leg.loc.lat, leg.loc.lng)
                    );
                  }, this._journeyLineDrawWait * 65);
                });
              });
              _.each(UPCOMING_JOURNEYS, (journey:Array<Airport>, index:number) => {
                let upcomingJourneyLine:Polyline = this._upcomingJourneyLines[index];
                _.each(journey, (leg:Airport) => {
                  this._journeyLineDrawWait++;
                  _.delay(() => {
                    upcomingJourneyLine.getPath().push(
                      new LatLng(leg.loc.lat, leg.loc.lng)
                    );
                  }, this._journeyLineDrawWait * 65);
                });
              });
              this._additionalMarkerWait = ((AIRPORTS.length - 1) * 100);
              _.each(CITIES, (city:City, index:number) => {
                _.delay(() => {
                  this.addMarker(city, index);
                }, (index * 650) + this._additionalMarkerWait);
              });
              _.delay(() => {
                this.map.panTo(p.WELLINGTON);
                this.zoomMap(this.map.getZoom() + 1, $(window).width() >= 1000 ? 11 : 10);
              }, ((CITIES.length) * 700) + this._additionalMarkerWait);
            }, this._markerWait);
          }
        }
      });
    })(jQuery);
  }

  addMarker(city:City, index:number) {
    this._cityMarkers.push(new Marker({
      position: new LatLng(city.loc.lat, city.loc.lng),
      map: this.map,
      title: city.title,
      draggable: false,
      animation: Animation.DROP,
      zIndex: 200,
      icon: city.icon
    }));
    let cityMarker:Marker = this._cityMarkers[index];
    event.addListener(cityMarker, 'click', () => {
      this.toggleBounce(cityMarker, city.title);
    });
  }

  zoomMap(nextZoomLevel:number = 0, maxZoom:number = 0) {
    if (nextZoomLevel < maxZoom) {
      this._tilesLoadedEvent = event.addListener(this.map, 'tilesloaded', () => {
        event.removeListener(this._tilesLoadedEvent);
        this.zoomMap(this.map.getZoom() + 1, maxZoom);
      });
      _.delay(() => {
        this.map.setZoom(nextZoomLevel);
      }, 280);
    } else {
      this.map.setOptions({
        scrollwheel: true
      });
    }
  }

  toggleBounce(marker:Marker, infoTitle:string, infoContent?:string) {
    if (this._timeoutMarkerBounce) {
      clearTimeout(this._timeoutMarkerBounce);
    }
    marker.setAnimation(Animation.BOUNCE);
    this._infoWindow.close();
    let content = infoContent ?
      `
        <div class="map-info-window">
          <h3>${infoTitle}</h3>
          <p>${infoContent}</p>
        </div>
      `: `
        <div class="map-info-window">
          <h3>${infoTitle}</h3>
        </div>
      `;
    this._infoWindow.setContent(content);
    this._infoWindow.open(this.map, marker);
    this._timeoutMarkerBounce = _.delay(() => {
      marker.setAnimation(null);
    }, 2000);
  }
}
