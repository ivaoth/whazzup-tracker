import { Pipe, PipeTransform } from '@angular/core';
import { PilotSessionWithValidation } from './shared/types';

@Pipe({
  name: 'trackerLink'
})
export class TrackerLinkPipe implements PipeTransform {
  constructor() {}
  transform(value: PilotSessionWithValidation, args?: any): any {
    return `https://tracker.ivao.aero/sessions/${value.id}`;
  }
}
