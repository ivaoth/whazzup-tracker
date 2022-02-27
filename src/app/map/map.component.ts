import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { boundingExtent } from 'ol/extent';
import Feature from 'ol/Feature';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import Map from 'ol/Map';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Icon from 'ol/style/Icon';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';
import { combineLatest, Observable, Subject } from 'rxjs';
import { filter, first, map, scan, shareReplay, tap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { IPilotLastTrack, PilotSessionWithValidation } from '../shared/types';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  data: Observable<PilotSessionWithValidation[]>;
  filteredData$: Observable<PilotSessionWithValidation[]>;
  map!: Map;
  markerLayer: VectorLayer;
  smallMarkerLayer!: VectorLayer;
  markerstatus: Observable<{
    sessionIndex: number;
    sessionTrackIndex: number;
    isShowing: boolean;
    data: PilotSessionWithValidation[];
  }>;
  markerEvent: Subject<MarkerEvent> = new Subject();

  @ViewChild('openLayers') mapElement!: ElementRef;

  constructor(private _data: DataService, private route: ActivatedRoute) {
    this.data = _data.dataSubject;
    this.filteredData$ = combineLatest([
      this.data,
      this.route.queryParamMap.pipe(map((p) => p.getAll('id'))),
    ]).pipe(
      map(([data, id]) => {
        const ids = id.map((i) => parseInt(i, 10));
        return data.filter((d) => ids.includes(d.id));
      }),
      tap((v) => {
        this.markerEvent.next({
          type: 'data',
          payload: {
            data: v,
          },
        });
      })
    );
    const markerFeature = new Feature({
      geometry: new Point(fromLonLat([0, 0])),
    });
    markerFeature.setStyle(
      new Style({
        image: new Icon({
          src: '/assets/pin.png',
          scale: 0.25,
          anchor: [0.5, 1],
          rotation: Math.PI,
        }),
      })
    );
    markerFeature.setId(1);
    this.markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [markerFeature],
      }),
      visible: false,
    });
    this.markerstatus = this.markerEvent.pipe(
      scan(
        (prev, event) => {
          switch (event.type) {
            case 'remove':
              return { ...prev, isShowing: false };
            case 'set':
              return {
                ...prev,
                sessionIndex: event.payload.sessionIndex,
                sessionTrackIndex: event.payload.sessionTrackIndex,
                isShowing: true,
              };
            case 'forward':
              const currentSessionTrackLength =
                prev.data[prev.sessionIndex].tracks.length;
              if (prev.sessionTrackIndex < currentSessionTrackLength - 1) {
                return {
                  ...prev,
                  sessionTrackIndex: prev.sessionTrackIndex + 1,
                };
              } else if (prev.sessionIndex < prev.data.length - 1) {
                return {
                  ...prev,
                  sessionTrackIndex: 0,
                  sessionIndex: prev.sessionIndex + 1,
                };
              } else {
                return { ...prev };
              }
            case 'backward': {
              if (prev.sessionTrackIndex > 0) {
                return {
                  ...prev,
                  sessionTrackIndex: prev.sessionTrackIndex - 1,
                };
              } else if (prev.sessionIndex > 0) {
                return {
                  ...prev,
                  sessionIndex: prev.sessionIndex - 1,
                  sessionTrackIndex:
                    prev.data[prev.sessionIndex - 1].tracks.length - 1,
                };
              } else {
                return { ...prev };
              }
            }
            case 'data': {
              return { ...prev, data: event.payload.data };
            }
          }
        },
        {
          sessionIndex: 0,
          sessionTrackIndex: 0,
          isShowing: false as boolean,
          data: [] as PilotSessionWithValidation[],
        }
      ),
      tap((v) => {
        if (v.data.length > 0) {
          if (
            (v.sessionIndex < v.data.length ||
              v.sessionTrackIndex < v.data[v.sessionIndex].tracks.length) &&
            v.isShowing
          ) {
            this.markerLayer.setVisible(true);
            const track = v.data[v.sessionIndex].tracks[v.sessionTrackIndex];
            this.markerLayer
              .getSource()
              .getFeatureById(1)
              .setGeometry(
                new Point(fromLonLat([track.longitude, track.latitude]))
              );
          } else {
            this.markerLayer.setVisible(false);
          }
        }
      }),
      shareReplay()
    );
  }

  ngOnInit() {
    this.map = new Map({
      layers: [new TileLayer({ source: new OSM() })],
    });
  }

  ngAfterViewInit() {
    this.filteredData$
      .pipe(
        filter((d) => d.length > 0),
        first()
      )
      .subscribe((s) => {
        this.map.setTarget(this.mapElement.nativeElement);
        const tracks = ([] as IPilotLastTrack[]).concat(
          ...s.map((session) => session.tracks)
        );
        const points = tracks.map((p) => {
          return fromLonLat([p.longitude, p.latitude]);
        });
        const lineFeatures: Feature[] = [];
        for (let i = 0; i <= tracks.length - 2; i++) {
          const f = new Feature({
            geometry: new LineString([points[i], points[i + 1]]),
          });
          f.setStyle(
            new Style({
              stroke: new Stroke({
                width: 2,
                color: tracks[i].onGround
                  ? 'black'
                  : this.getAltitudeColour(tracks[i].altitude),
              }),
            })
          );
          lineFeatures.push(f);
        }
        const iconStyle = new Style({
          image: new Icon({
            src: '/assets/pin.png',
            scale: 0.1,
            anchor: [0.5, 1],
          }),
        });
        const pointerFeatures = points.map((p) => {
          const f = new Feature({
            geometry: new Point(p),
          });
          f.setStyle(iconStyle);
          return f;
        });
        this.smallMarkerLayer = new VectorLayer({
          source: new VectorSource({ features: pointerFeatures }),
        });
        this.map
          .getView()
          .fit(boundingExtent(points), { padding: [50, 50, 50, 50] });
        this.map.addLayer(
          new VectorLayer({
            source: new VectorSource({ features: lineFeatures }),
          })
        );
        this.map.addLayer(this.smallMarkerLayer);
        this.map.addLayer(this.markerLayer);
      });
  }

  setMarker(sessionIndex: number, sessionTrackIndex: number) {
    this.markerEvent.next({
      type: 'set',
      payload: {
        sessionIndex,
        sessionTrackIndex,
      },
    });
  }

  removeMarker() {
    this.markerEvent.next({
      type: 'remove',
    });
  }

  goBackward() {
    this.markerEvent.next({
      type: 'backward',
    });
  }

  goForward() {
    this.markerEvent.next({
      type: 'forward',
    });
  }

  validate(valid: boolean) {
    this.route.queryParamMap
      .pipe(
        map((pm) => {
          return pm.getAll('id');
        }),
        map((ids) => {
          return ids.map((id) => parseInt(id, 10));
        }),
        first()
      )
      .subscribe((ids) => {
        this._data.validateBulk(ids, valid);
      });
  }

  reset() {
    this.route.queryParamMap
      .pipe(
        map((pm) => {
          return pm.getAll('id');
        }),
        map((ids) => {
          return ids.map((id) => parseInt(id, 10));
        }),
        first()
      )
      .subscribe((ids) => {
        this._data.resetBulk(ids);
      });
  }

  toggleSmallMarkers() {
    this.smallMarkerLayer.setVisible(!this.smallMarkerLayer.getVisible());
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

type MarkerEvent =
  | RemoveMarkerEvent
  | SetMarkerEvent
  | MoveMarkerForwardEvent
  | MoveMarkerBackwardEvent
  | DataMarkerEvent;

type RemoveMarkerEvent = {
  type: 'remove';
};

type SetMarkerEvent = {
  type: 'set';
  payload: {
    sessionIndex: number;
    sessionTrackIndex: number;
  };
};

type MoveMarkerForwardEvent = {
  type: 'forward';
};

type MoveMarkerBackwardEvent = {
  type: 'backward';
};

type DataMarkerEvent = {
  type: 'data';
  payload: {
    data: PilotSessionWithValidation[];
  };
};
