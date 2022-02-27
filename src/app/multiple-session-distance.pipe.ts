import { Pipe, PipeTransform } from '@angular/core';
import { PilotSessionWithValidation, IPilotLastTrack } from './shared/types';
import { getDistance, DEFAULT_RADIUS } from 'ol/sphere';
import { SessionDistancePipe } from './session-distance.pipe';

@Pipe({
  name: 'multipleSessionDistance',
})
export class MultipleSessionDistancePipe implements PipeTransform {
  transform(
    [value, selected]: [PilotSessionWithValidation[], number[]],
    ...args: unknown[]
  ): [number, number] {
    const sessionDistancePipe = new SessionDistancePipe();
    const selectedSessions = value.filter((s) => selected.includes(s.id));
    return [
      selectedSessions
        .map((t) => sessionDistancePipe.transform(t.tracks))
        .reduce((p, c) => p + c, 0),
      sessionDistancePipe.transform(
        ([] as IPilotLastTrack[]).concat(
          ...selectedSessions.map((t) => t.tracks)
        )
      ),
    ];
  }
}
