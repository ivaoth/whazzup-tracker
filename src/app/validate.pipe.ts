import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'validate'
})
export class ValidatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
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
