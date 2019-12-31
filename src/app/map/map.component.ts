import { LatLngBoundsLiteral } from '@agm/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { DataService } from '../data.service';
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
    this.updateData();
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
}
