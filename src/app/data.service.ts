import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { first, tap } from 'rxjs/operators';
import { DownloadService } from './download.service';
import { WhazzupSession } from './shared/whazzup-session';
import * as idbKv from 'idb-keyval';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataSubject: BehaviorSubject<WhazzupSession[]>;
  dataSubjectInput: Subject<WhazzupSession[]>;
  resolved = false;

  constructor(
    private downloadService: DownloadService
  ) {
    this.dataSubject = new BehaviorSubject([]);
    this.dataSubjectInput = new Subject();
    idbKv.get<WhazzupSession[]>('whazzup_sessions_data').then((d) => {
      if (d) {
        this.dataSubject.next(d);
      }
      this.dataSubjectInput.subscribe((d) => {
        idbKv.set('whazzup_sessions_data', d).then(() => {
          this.dataSubject.next(d);
        });
      })
    });
  }

  setData(data: any[]) {
    this.dataSubjectInput.next(data);

  }

  validateBulk(ids: number[], valid: boolean) {
    this.dataSubject.pipe(first()).subscribe(d => {
      this.dataSubjectInput.next(d.map((s, i) => {
        if (ids.includes(i)) {
          return {
            ...s,
            valid,
            validated: true
          };
        }
        return s;
      }));
    });
  }

  validate(id: number, valid: boolean) {
    this.validateBulk([id], valid);
  }

  resetBulk(ids: number[]) {
    this.dataSubject.pipe(first()).subscribe(d => {
      this.dataSubjectInput.next(d.map((s, i) => {
        if (ids.includes(i)) {
          return {
            ...s,
            validated: false
          };
        }
        return s;
      }));
    });
  }

  reset(id: number) {
    this.resetBulk([id]);
  }

  download() {

    this.dataSubject.pipe(first()).subscribe(d => {
      this.downloadService.download(
        JSON.stringify(d, null, 2),
        'whazzup-data.json'
      );
    });
  }
}
