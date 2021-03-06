import LatLng = google.maps.LatLng;
import Map = google.maps.Map;
import event = google.maps.event;
import Polyline = google.maps.Polyline;
import IconSequence = google.maps.IconSequence;
import {IPoint} from '../../definitions/point';
import {PolylineIconSequence} from '../../definitions/polyline.icon.sequence';
import {delay} from '../../../shared/common/delay';

export class PolylineUtil {
  private _lineDrawWait: number;
  private _polylines: Array<Polyline> = [];
  private _dottedPolylines: Array<PolylineIconSequence> = [];
  private _weightBase: number = 1.25;
  private _weightExp1: number = 1;
  private _weightExp2: number = 2;
  private _weightExp3: number = 3;
  private _weightExp4: number = 4;
  private _weightExp5: number = 6;

  constructor() {
    this._lineDrawWait = 0;
  }

  createPolylines(journeys: Array<Array<IPoint>>, map: Map, strokeColor: string): Array<Polyline> {
    const lines: Array<Polyline> = [];
    journeys.forEach((journey: Array<IPoint>, index: number) => {
      lines[index] = new Polyline({
        geodesic: true,
        map,
        strokeColor,
        strokeOpacity: 0.9,
        strokeWeight: this._weightBase,
        zIndex: 2,
      });
    });

    this._polylines.push(...lines);
    return lines;
  }

  createPolylineFromPath(encodedPaths: Array<string>, map: Map, strokeColor: string): void {
    encodedPaths.forEach((encodedPath: string) => {
      const path: Array<LatLng> = google.maps.geometry.encoding.decodePath(encodedPath);
      const line: Polyline = new Polyline({
        path,
        strokeColor,
        strokeOpacity: 0.9,
        strokeWeight: this._weightBase,
        zIndex: 2,
      });

      this._polylines.push(line);
      delay(++this._lineDrawWait * 130)
        .then(() => {
          line.setMap(map);
        });
    });
  }

  createDottedPolylines(journeys: Array<Array<IPoint>>, map: Map, strokeColor: string): Array<Polyline> {
    const lines: Array<Polyline> = [];
    journeys.forEach((journey: Array<IPoint>, index: number) => {
      const linesIcons: IconSequence[] = [
        {
          icon: {
            path: 'M 0, -1 0,1',
            strokeColor,
            strokeOpacity: 0.9,
            strokeWeight: this._weightBase,
          },
          offset: '0',
          repeat: '12px',
        },
      ];
      const polyline = new Polyline({
        geodesic: true,
        icons: linesIcons,
        map,
        strokeOpacity: 0,
        zIndex: 2,
      });
      lines[index] = polyline;
      this._dottedPolylines.push({polyline, linesIcons});
    });
    return lines;
  }

  createDottedPolylineFromPath(encodedPaths: Array<string>, map: Map, strokeColor: string): void {
    encodedPaths.forEach((encodedPath: string) => {
      const path: Array<LatLng> = google.maps.geometry.encoding.decodePath(encodedPath);
      const linesIcons: IconSequence[] = [
        {
          icon: {
            path: 'M 0, -1 0,1',
            strokeColor,
            strokeOpacity: 0.9,
            strokeWeight: this._weightBase,
          },
          offset: '0',
          repeat: '12px',
        },
      ];
      const polyline: Polyline = new Polyline({
        icons: linesIcons,
        path,
        strokeOpacity: 0,
        zIndex: 2,
      });

      this._dottedPolylines.push({polyline, linesIcons});
      delay(++this._lineDrawWait * 130)
        .then(() => {
          polyline.setMap(map);
        });
    });
  }

  pushToPolylines(polylines: Array<Polyline>, journeys: Array<Array<IPoint>>): void {
    journeys.forEach((journey: Array<IPoint>, index: number) => {
      const polyline: Polyline = polylines[index];
      this._lineDrawWait++;
      journey.forEach((leg: IPoint) =>
        delay(this._lineDrawWait * 130)
          .then(() => {
            const coordinates = new LatLng(leg.lat, leg.lng);
            polyline.getPath().push(coordinates);
          }));
    });
  }


  setZoomChangedListener(map: Map): void {
    event.addListener(map, 'zoom_changed', () => {
      const zoom: number = map.getZoom();
      const weightExponent: number = this.getWeightExponent(zoom);
      const strokeWeight = this._weightBase * weightExponent;
      this._polylines.forEach((polyline: Polyline) => {
        polyline.setOptions({
          strokeWeight,
        });
      });

      if (zoom < 18) {
        this._dottedPolylines.forEach((dottedPolyline: PolylineIconSequence) => {
          dottedPolyline.linesIcons[0].icon.strokeWeight = strokeWeight;
          dottedPolyline.polyline.setOptions({icons: dottedPolyline.linesIcons});
        });
      }
    });
  }

  private getWeightExponent(zoom: number): number {
    switch (zoom) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
        return this._weightExp1;
      case 5:
      case 6:
      case 7:
      case 8:
        return this._weightExp2;
      case 9:
      case 10:
      case 11:
      case 12:
        return this._weightExp3;
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
        return this._weightExp4;
      case 18:
      case 19:
      case 20:
      case 21:
      case 22:
        return this._weightExp5;
      default:
        return this._weightExp1;
    }
  }
}
