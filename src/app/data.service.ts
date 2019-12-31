import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DownloadService } from './download.service';
import { WhazzupSession } from './shared/whazzup-session';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: WhazzupSession[];
  resolved = false;

  constructor(
    private downloadService: DownloadService
  ) {}

  private fetchData() {
    try {
      const data = JSON.parse(localStorage.getItem('whazzup_tracker_data'));
      return of(data);
    } catch (e) {
      return of([]);
    }
  }

  getData(): Observable<any[]> {
    if (this.resolved) {
      return of(this.data);
    } else {
      return this.fetchData().pipe(
        tap(d => {
          this.data = d;
          this.resolved = true;
        })
      );
    }
  }

  setData(data: any[]) {
    localStorage.setItem('whazzup_tracker_data', JSON.stringify(data));
    this.data = data;
  }

  validate(id: number, valid: boolean) {
    this.data = this.data.map(s => {
      if (s.id === id) {
        return {
          ...s,
          valid,
          validated: true
        };
      }
      return s;
    });
    localStorage.setItem('whazzup_tracker_data', JSON.stringify(this.data));
  }

  reset(id: number) {
    this.data = this.data.map(s => {
      if (s.id === id) {
        return {
          ...s,
          validated: false
        };
      }
      return s;
    });
    localStorage.setItem('whazzup_tracker_data', JSON.stringify(this.data));
  }

  download() {
    this.downloadService.download(
      JSON.stringify(this.data, null, 2),
      'whazzup-data.json'
    );
  }
}
