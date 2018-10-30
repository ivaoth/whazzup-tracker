import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trackerLink'
})
export class TrackerLinkPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return `https://tracker.ivao.aero/search.php?vid=${value.vid}&callsign=${
      value.callsign
    }&conntype=PILOT&date=2018-06-23&search=Search`;
  }
}
