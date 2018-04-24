import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'htmlTemplate'
})
export class HtmlTemplatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    value = this.scrub(value, /a#([^}]+)#a/g, 'links');
    value = this.scrub(value, /b#([^}]+)#b/g, 'bolds');
    value = this.scrub(value, /i#([^}]+)#i/g, 'italics');
    return value.replace(/#r/g, '<br/><br/>');
  }

  scrub(value, regex, method) {
    let curMatch;
    while( curMatch = regex.exec(value) ) {
        value = this[method](value, curMatch);
    }
    return value;
  }

  links(value, match) {
    let link = match[1].split('|');
    return value.replace(match[0],
      `<a href="${link[1]}" target="_blank" class="floating-link">${link[0]}</a>`
    );
  }

  bolds(value, match) {
    return value.replace(match[0], `<span class="dense">${match[1]}</span>`);
  }

  italics(value, match) {
    return value.replace(match[0], `<span class="italic">${match[1]}</span>`);
  }

}
