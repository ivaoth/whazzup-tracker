import { Pipe, PipeTransform, Inject } from '@angular/core';
import { EVENT_DATE } from './event-date';

@Pipe({
  name: 'trackerLink'
})
export class TrackerLinkPipe implements PipeTransform {
  constructor(@Inject(EVENT_DATE) private eventDate: string) {}
  transform(value: any, args?: any): any {
    return `https://tracker.ivao.aero/search.php?vid=${value.vid}&callsign=${
      value.callsign
    }&conntype=PILOT&date=${this.eventDate}&search=Search`;
  }
}
