import { Pipe, PipeTransform } from '@angular/core';
import { WhazzupSession } from './shared/whazzup-session';

@Pipe({
  name: 'validate'
})
export class ValidatePipe implements PipeTransform {

  transform(value: WhazzupSession, args?: any): any {
    if (value.validated) {
      if (value.valid) {
        return 'Validated as valid';
      } else {
        return 'Validated as invalid';
      }
    } else {
      return 'Not validated';
    }
  }

}
