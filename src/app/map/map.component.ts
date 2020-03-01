import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { DataService } from '../data.service';
import { WhazzupSession } from '../shared/whazzup-session';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileDebug from 'ol/source/TileDebug';
import TileLayer from 'ol/layer/Tile';
import { boundingExtent } from 'ol/extent';
import { fromLonLat } from 'ol/proj';
import LineString from 'ol/geom/LineString';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  lat = 0;
  lon = 0;

  data: Observable<WhazzupSession[]>;
  client$: Observable<WhazzupSession>;
  markerLat: number;
  markerLon: number;
  markerShow = false;
  showingPointIndex: number;
  map: Map;
  markerLayer: VectorLayer;

  @ViewChild('openLayers', { static: false }) mapElement: ElementRef;

  constructor(private _data: DataService, private route: ActivatedRoute) {
    this.data = _data.getData();
  }

  ngOnInit() {
    this.updateData();
    this.map = new Map({
      layers: [
        new TileLayer({ source: new OSM() }),
        new TileLayer({ source: new TileDebug() })
      ]
    });
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([0, 0]))
    });
    markerFeature.setStyle(
      new Style({
        image: new Icon({
          src: '/assets/pin.png',
          scale: 0.25,
          anchor: [0.5, 1],
          rotation: Math.PI
        })
      })
    );
    markerFeature.setId(1);
    this.markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [markerFeature]
      }),
      visible: false
    });
  }

  ngAfterViewInit() {
    this.map.setTarget(this.mapElement.nativeElement);

    this.client$.pipe(first()).subscribe(s => {
      const points = s.positions.map(p => {
        return fromLonLat([p.longtitude, p.latitude]);
      });
      const lineFeatures: Feature[] = [];
      for (let i = 0; i <= s.positions.length - 2; i++) {
        const f = new Feature({
          geometry: new LineString([points[i], points[i + 1]])
        });
        f.setStyle(
          new Style({
            stroke: new Stroke({
              width: 2,
              color: s.positions[i].onGround
                ? 'black'
                : this.getAltitudeColour(s.positions[i].altitude)
            })
          })
        );
        lineFeatures.push(f);
      }
      const iconStyle = new Style({
        image: new Icon({
          src: '/assets/pin.png',
          scale: 0.1,
          anchor: [0.5, 1]
        })
      });
      const pointerFeatures = points.map(p => {
        const f = new Feature({
          geometry: new Point(p)
        });
        f.setStyle(iconStyle);
        return f;
      });
      this.map
        .getView()
        .fit(boundingExtent(points), { padding: [50, 50, 50, 50] });
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({ features: lineFeatures })
        })
      );
      this.map.addLayer(
        new VectorLayer({
          source: new VectorSource({ features: pointerFeatures })
        })
      );
      this.map.addLayer(this.markerLayer);
    });
  }

  showPosition(index: number, sLatitude: string, sLongitude: string) {
    const latitude = parseFloat(sLatitude);
    const longitude = parseFloat(sLongitude);
    this.showingPointIndex = index;
    this.markerLayer
      .getSource()
      .getFeatureById(1)
      .setGeometry(new Point(fromLonLat([longitude, latitude])));
    this.markerLayer.setVisible(true);
  }

  removeMarker() {
    this.markerLayer.setVisible(false);
  }

  validate(valid: boolean) {
    this.route.queryParamMap
      .pipe(
        map(pm => {
          return pm.getAll('id');
        }),
        map(ids => {
          return ids.map(id => parseInt(id, 10));
        }),
        first()
      )
      .subscribe(ids => {
        this._data.validateBulk(ids, valid);
      });
    this.data = this._data.getData();
    this.updateData();
  }

  reset() {
    this.route.queryParamMap
      .pipe(
        map(pm => {
          return pm.getAll('id');
        }),
        map(ids => {
          return ids.map(id => parseInt(id, 10));
        }),
        first()
      )
      .subscribe(ids => {
        this._data.resetBulk(ids);
      });
    this.data = this._data.getData();
    this.updateData();
  }

  private updateData() {
    this.client$ = combineLatest([
      this.data,
      this.route.queryParamMap.pipe(map(p => p.getAll('id')))
    ]).pipe(
      map(([data, id]) => {
        return id.map(i => {
          return data.find(v => {
            return v.id === parseInt(i, 10);
          });
        });
      }),
      map(sessions => {
        return {
          ...sessions[0],
          flightPlans: sessions
            .map(s => s.flightPlans)
            .reduce((prev, curr) => prev.concat(curr), []),
          positions: sessions
            .map(s => s.positions)
            .reduce((prev, curr) => prev.concat(curr), [])
        };
      })
    );
  }

  private getAltitudeColour(altitude: number): string {
    if (altitude <= 2100) {
      return '#FFE700';
    } else if (altitude <= 6000) {
      return '#FF8C00';
    } else if (altitude <= 12000) {
      return '#00FF00';
    } else if (altitude <= 18000) {
      return '#00FFFF';
    } else if (altitude <= 24000) {
      return '#3D00FF';
    } else if (altitude <= 32000) {
      return '#FF00FF';
    } else {
      return '#FF0033';
    }
  }
}
