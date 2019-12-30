import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable, combineLatest, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, take, first } from 'rxjs/operators';
import { LatLngBoundsLiteral } from '@agm/core';
import { WhazzupSession } from '../shared/whazzup-session';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  lat = 0;
  lon = 0;

  data: Observable<WhazzupSession[]>;
  client$: Observable<WhazzupSession>;
  bound$: Observable<LatLngBoundsLiteral>;
  markerLat: number;
  markerLon: number;
  markerShow = false;
  showingPointIndex: number;

  constructor(private _data: DataService, private route: ActivatedRoute) {
    this.data = _data.getData();
  }

  ngOnInit() {
    this.client$ = combineLatest([
      this.data,
      this.route.paramMap.pipe(map(p => p.get('id')))
    ]).pipe(
      map(([data, id]) => {
        return data.find(v => {
          return v.id === parseInt(id, 10);
        });
      })
    );
    this.bound$ = this.client$.pipe(
      map(c => {
        let west: number;
        let east: number;
        let north: number;
        let south: number;
        for (const position of c.positions) {
          const lat = position.latitude;
          const lon = position.longtitude;
          if (!west || lon < west) {
            west = lon;
          }
          if (!east || lon > east) {
            east = lon;
          }
          if (!north || lat > north) {
            north = lat;
          }
          if (!south || lat < south) {
            south = lat;
          }
        }
        return {
          north,
          east,
          south,
          west
        };
      })
    );
  }

  showPosition(index: number, sLatitude: string, sLongitude: string) {
    const latitude = parseFloat(sLatitude);
    const longitude = parseFloat(sLongitude);
    this.showingPointIndex = index;
    this.markerLat = latitude;
    this.markerLon = longitude;
    this.markerShow = true;
  }

  removeMarker() {
    this.markerShow = false;
  }

  validate(valid: boolean) {
    this.route.paramMap
      .pipe(
        map(pm => {
          return pm.get('id');
        }),
        map(ids => {
          return parseInt(ids, 10);
        }),
        first()
      )
      .subscribe(id => {
        this._data.validate(id, valid);
      });
    this.data = this._data.getData();
    this.client$ = combineLatest([
      this.data,
      this.route.paramMap.pipe(map(p => p.get('id')))
    ]).pipe(
      map(([data, id]) => {
        return data.find(v => {
          return v.id === parseInt(id, 10);
        });
      })
    );
  }

  reset() {
    this.route.paramMap
      .pipe(
        map(pm => {
          return pm.get('id');
        }),
        map(ids => {
          return parseInt(ids, 10);
        }),
        first()
      )
      .subscribe(id => {
        this._data.reset(id);
      });
    this.data = this._data.getData();
    this.client$ = combineLatest([
      this.data,
      this.route.paramMap.pipe(map(p => p.get('id')))
    ]).pipe(
      map(([data, id]) => {
        return data.find(v => {
          return v.id === parseInt(id, 10);
        });
      })
    );
  }
}
