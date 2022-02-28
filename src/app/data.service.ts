import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { first, shareReplay } from 'rxjs/operators';
import { DownloadService } from './download.service';
import { PilotSessionWithValidation } from './shared/types';
import * as idbKv from 'idb-keyval';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataSubject: Observable<PilotSessionWithValidation[]>;
  private dataSubjectInternal: Subject<PilotSessionWithValidation[]>;
  dataSubjectInput: Subject<PilotSessionWithValidation[]>;
  resolved = false;

  constructor(private downloadService: DownloadService) {
    this.dataSubjectInternal = new Subject();
    this.dataSubject = this.dataSubjectInternal.pipe(shareReplay(1));
    this.dataSubjectInput = new Subject();
    idbKv
      .get<PilotSessionWithValidation[]>('whazzup_sessions_data')
      .then((d) => {
        if (d) {
          this.dataSubjectInternal.next(d);
        }
        this.dataSubjectInput.subscribe((d) => {
          idbKv.set('whazzup_sessions_data', d).then(() => {
            this.dataSubjectInternal.next(d);
          });
        });
      });
  }

  setData(data: any[]) {
    this.dataSubjectInput.next(data);
  }

  validateBulk(ids: number[], valid: boolean) {
    this.dataSubjectInternal.pipe(first()).subscribe((d) => {
      this.dataSubjectInput.next(
        d.map((s) => {
          if (ids.includes(s.id)) {
            return {
              ...s,
              valid,
              validated: true,
            };
          }
          return s;
        })
      );
    });
  }

  validate(id: number, valid: boolean) {
    this.validateBulk([id], valid);
  }

  resetBulk(ids: number[]) {
    this.dataSubjectInternal.pipe(first()).subscribe((d) => {
      this.dataSubjectInput.next(
        d.map((s) => {
          if (ids.includes(s.id)) {
            return {
              ...s,
              validated: false,
            };
          }
          return s;
        })
      );
    });
  }

  reset(id: number) {
    this.resetBulk([id]);
  }

  download() {
    this.dataSubject.pipe(first()).subscribe((d) => {
      this.downloadService.download(
        JSON.stringify(d, null, 2),
        'whazzup-data.json'
      );
    });
  }
}
