import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formError'
})
export class FormErrorPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    let errors = [];
    for (let key in value) {
      errors.push(value[key].message);
    }
    return errors.reverse();
  }

}
