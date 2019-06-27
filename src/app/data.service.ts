import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DownloadService } from './download.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  data: any[];
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
    const dataIndex = this.data.findIndex(s => {
      return s.id === id;
    });
    this.data = [
      ...this.data.slice(0, dataIndex),
      { ...this.data[dataIndex], validated: true, valid },
      ...this.data.slice(dataIndex + 1)
    ];
    localStorage.setItem('whazzup_tracker_data', JSON.stringify(this.data));
  }

  reset(id: number) {
    const dataIndex = this.data.findIndex(s => {
      return s.id === id;
    });
    this.data = [
      ...this.data.slice(0, dataIndex),
      { ...this.data[dataIndex], validated: false },
      ...this.data.slice(dataIndex + 1)
    ];
    localStorage.setItem('whazzup_tracker_data', JSON.stringify(this.data));
  }

  download() {
    this.downloadService.download(
      JSON.stringify(this.data, null, 2),
      'whazzup-data.json'
    );
  }
}
