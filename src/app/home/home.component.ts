import { ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Observable } from 'rxjs';
import { delay, filter, first, switchMap, tap, shareReplay, map } from 'rxjs/operators';
import { DataService } from '../data.service';
import { DownloadService } from '../download.service';
import { WhazzupSession } from '../shared/whazzup-session';
import { User } from '../shared/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  data: Observable<WhazzupSession[]>;
  groupedData: Observable<User[]>;
  loadedData: any[];
  constructor(
    private _data: DataService,
    private cd: ChangeDetectorRef,
    private download: DownloadService,
    private viewportScroller: ViewportScroller,
    private router: Router
  ) {
    this.data = _data.getData().pipe(shareReplay(1));
    this.groupedData = this.data.pipe(map(s => {
      return s.reduce((prev: User[], curr: WhazzupSession) => {
        const index = prev.findIndex(v => v.vid === curr.vid);
        if (index !== -1) {
          return prev.map(v => {
            if (v.vid === curr.vid) {
              return {
                ...v,
                sessions: [
                  ...v.sessions,
                  curr
                ]
              };
            }
            return v;
          });
        }
        return [
          ...prev,
          {
            vid: curr.vid,
            sessions: [curr]
          }
        ];
      }, [] as User[]);
    }));
    this.router.events
      .pipe(
        filter((e): e is Scroll => e instanceof Scroll),
        filter(e => !!e.position),
        switchMap(e => {
          return this.data.pipe(
            delay(0),
            tap(_ => {
              this.viewportScroller.scrollToPosition(e.position);
            })
          );
        })
      )
      .subscribe();
  }

  onFileChanged(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);
      reader.onload = () => {
        this.loadedData = JSON.parse(reader.result as string);
        this.cd.markForCheck();
      };
    }
  }

  loadData() {
    this._data.setData(this.loadedData);
    this.data = this._data.getData();
  }

  downloadData() {
    this._data.download();
  }

  downloadResult(valid: boolean) {
    this.data.pipe(first()).subscribe(d => {
      const vids = this.uniq(
        d.filter(c => c.validated && c.valid === valid).map(s => s.vid)
      );
      this.download.download(vids.join('\n'), `output-${valid}.txt`);
    });
  }

  private uniq(a: any[]) {
    const seen = {};
    return a.filter(i => {
      return (seen as Object).hasOwnProperty(i) ? false : (seen[i] = true);
    });
  }
}
