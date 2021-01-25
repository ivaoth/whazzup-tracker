import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs';
import { WhazzupSession } from './shared/whazzup-session';
import { map } from 'rxjs/operators';

@Pipe({
  name: 'clientById'
})
export class ClientByIdPipe implements PipeTransform {
  data: Observable<WhazzupSession[]>

  constructor(_data: DataService) {
    this.data = _data.dataSubject;
  }

  transform(value: number): Observable<WhazzupSession> {
    return this.data.pipe(map(d => {
      return d[value];
    }));
  }

}
