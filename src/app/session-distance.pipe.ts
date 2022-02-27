import { Pipe, PipeTransform } from '@angular/core';
import { PilotSessionWithValidation, IPilotLastTrack } from './shared/types';
import { getDistance, DEFAULT_RADIUS } from 'ol/sphere';

@Pipe({
  name: 'sessionDistance',
})
export class SessionDistancePipe implements PipeTransform {
  transform(value: IPilotLastTrack[], ...args: unknown[]): number {
    return value.reduce(
      (prev, curr) => {
        if (prev.lastTrack) {
          return {
            accumulativeDistance:
              prev.accumulativeDistance +
              getDistance(
                [prev.lastTrack.longitude, prev.lastTrack.latitude],
                [curr.longitude, curr.latitude],
                DEFAULT_RADIUS / 1852
              ),
            lastTrack: curr,
          };
        } else {
          return {
            ...prev,
            lastTrack: curr,
          };
        }
      },
      {
        accumulativeDistance: 0,
        lastTrack: null as IPilotLastTrack | null,
      }
    ).accumulativeDistance;
  }
}
