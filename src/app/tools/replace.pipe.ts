import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceHttp'
})
export class ReplacePipe implements PipeTransform {

  transform(value: string): string {
    return value.replace('http://', 'https://');
  }

}
