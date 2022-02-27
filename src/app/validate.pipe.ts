import { Pipe, PipeTransform } from '@angular/core';
import { PilotSessionWithValidation } from './shared/types';

@Pipe({
  name: 'validate'
})
export class ValidatePipe implements PipeTransform {

  transform(value: PilotSessionWithValidation, args?: any): any {
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
