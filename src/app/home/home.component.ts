import { ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data.service';
import { first } from '../../../node_modules/rxjs/operators';
import { DownloadService } from '../download.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  data: Observable<any[]>;
  loadedData: any[];
  constructor(private _data: DataService, private cd: ChangeDetectorRef, private download: DownloadService) {
    this.data = _data.getData();
  }

  onFileChanged(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsText(file);
      reader.onload = () => {
        this.loadedData = JSON.parse(reader.result);
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
      const vids = this.uniq(d.filter(c => c.validated && c.valid === valid).map(s => s.vid));
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
