import { AbstractControl, Validators, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ValidationService {

    private tests = {
      required: function(control, params) {
        return { result: !!control.value, message: ' is required' };
      },

      min: function(control, params) {
        return { result: control.value.length > params, message: ' must be at least ' + params + ' characters long'};
      },

      max: function(control, params) {
        return { result: control.value.length < params, message: ' can only be ' + params + ' characters long'};
      },

      between: function(control, params) {
        const distance = params.split(',');
        const message = ' must be between ' + distance[0] + ' and ' + distance[1] + ' characters in length';
        return { result: control.value.length >= distance[0] && control.value.length <=  distance[1], message: message };
      },

      equal: function(control, params) {
        return { result: control.value === '' + params, message: ' must be equal to \'' + params + '\''};
      },

      email: function(control, params) {
        const regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
        return { result: regex.test(control.value), message: ' must be a valid email address'};
      },

      alpha : function(control, params) {
        const regex = /^[A-Za-z]+$/;
        return { result: regex.test(control.value), message: ' must contain only letters A-Z or a-z'};
      },

      alpha_dash : function(control, params) {
        const regex = /^[A-Za-z\-]+$/;
        return { result: regex.test(control.value), message: ' must contain only letters A-Z or a-z and dashes'};
      },

      numeric: function(control, params) {
        const regex = /^[0-9]*$/;
        return { result: regex.test(control.value), message: ' must contain only numbers 0-9'};
      },

      alpha_num : function(control, params) {
        const regex =  /^[A-Za-z0-9]+$/i;
        return { result: regex.test(control.value), message: ' may not contain any special characters'};
      },

      url: function(control, params) {
        const regex = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/i;
        return { result: regex.test(control.value), message: ' must be a valid url'};
      },

      decimal: function(control, params) {
        const regex = /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/;
        return { result: regex.test(control.value), message: ' must be a valid decimal number'};
      },

      digits: function(control, params) {
        const regex = /^[0-9]*$/;
        return { result: regex.test(control.value) && control.value.length == params, message: ' must be a number that is ' + params + ' digits long'};
      },

      digits_between: function(control, params) {
        const b = params.split(',');
        const regex = /^[0-9]*$/;
        return {
          result: regex.test(control.value) && control.value.length > b[0] && control.value.length < b[1],
          message: ' must be a number between ' + b[0] + ' and ' + b[1] + 'digits long'
        };
      },

      currency: function(control, params) {
        let value = control.value.replace(/\$/g, '');
        const regex = /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/;
        return { result: regex.test(value), message: ' must be a valid currency (0.00)'};
      },

      ip: function(control, params) {
        const regex = {
          ipv4: /^(?:(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])\.){3}(?:\d|[1-9]\d|1\d{2}|2[0-4]\d|25[0-5])$/,
          ipv4Cidr: /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\/([0-9]|[1-2][0-9]|3[0-2]))$/,
          ipv6: /^((?=.*::)(?!.*::.+::)(::)?([\dA-F]{1,4}:(:|\b)|){5}|([\dA-F]{1,4}:){6})((([\dA-F]{1,4}((?!\3)::|:\b|$))|(?!\2\3)){2}|(((2[0-4]|1\d|[1-9])?\d|25[0-5])\.?\b){4})$/i,
          ipv6Cidr: /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/
        };
        const test = regex.ipv4.test(control.value) || regex.ipv6.test(control.value) || regex.ipv4Cidr.test(control.value) || regex.ipv6Cidr.test(control.value);
        return { result: test, message: ' must be a valid IP address'};
      },

      time: function(control, params) {
        const regex = /^(2[0-3]|[01]?[0-9]):([0-5]?[0-9]):([0-5]?[0-9])$/;
        return { result: regex.test(control.value), message: ' must be a valid time (12:00)'};
      },

      ymd: function(control, params) {
        const regex = /^(?:\2)(?:[0-9]{2})?[0-9]{2}([\/-])(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])$/;
        return { result: regex.test(control.value), message: ' must be a valid date (YY/MM/DD)'};
      },

      dmy: function(control, params) {
        const regex = /^(3[01]|[12][0-9]|0?[1-9])([\/-])(1[0-2]|0?[1-9])([\/-])(?:[0-9]{2})?[0-9]{2}$/;
        return { result: regex.test(control.value), message: ' must be a valid date (DD/MM/YY)'};
      },

			mdy: function(control, params) {
        const regex = /^(1[0-2]|0?[1-9])([\/-])(3[01]|[12][0-9]|0?[1-9])([\/-])(?:[0-9]{2})?[0-9]{2}$/;
        return { result: regex.test(control.value), message: ' must be a valid date (MM/DD/YY)'};
      },

      createDates: function(date1, date2) {
        const d = date1.value.replace('_', '').split('/');
        let d1;
        const d2 = new Date(date2.replace('/', '-')+ 'Z');
        if (this.mdy(date1, '').result)
          d1 = new Date(`${d[2]}-${d[0]}-${d[1]}Z`);
        else if (this.dmy(date1, '').result)
          d1 = new Date(`${d[2]}-${d[1]}-${d[0]}Z`);
        else if (this.ymd(date1, '').result)
          d1 = new Date(`${d[0]}-${d[1]}-${d[2]}Z`);
        else return false;

        return { date1: d1, date2: d2 }
      },

      date: function(control, params) {
        const d = this.createDates(control, params);
        return { result: d != false, message: ' must be a valid date'};
      },

      date_equals: function(control, params) {
        const d = this.createDates(control, params);
        if (!d) return { result: false, message: ' must be a valid date'};
        return { result: d.date1 == d.date2, message: ' must be a date after ' + params};
      },

      date_format: function(control, params) {
        let test = this[params](control, params);
        return { result: test.result, message: test.message}
      },

      after: function(control, params) {
        const d = this.createDates(control, params);
        if (!d) return { result: false, message: ' must be a valid date'};
        return { result: d.date1 > d.date2, message: ' must be a date after ' + params};
      },

      after_or_equal: function(control, params) {
        const d = this.createDates(control, params);
        if (!d) return { result: false, message: ' must be a valid date'};
        return { result: d.date1 >= d.date2, message: ' must be a date after or equal to ' + params};
      },

      before: function(control, params) {
        const d = this.createDates(control, params);
        if (!d) return { result: false, message: ' must be a valid date'};
        return { result: d.date1 < d.date2, message: ' must be a date before ' + params};
      },

      before_or_equal: function(control, params) {
        const d = this.createDates(control, params);
        if (!d) return { result: false, message: ' must be a valid date'};
        return { result: d.date1 <= d.date2, message: ' must be a date before or equal to ' + params};
      },

      boolean: function(control, params) {
        const regex = /^(?:1?|0?|t(?:rue)?|f(?:alse)?)$/i;
        return { result: regex.test(control.value), message: ' must be either true or false'};
      },

      truthy: function(control, params) {
        const regex = /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?|on)$/i;
        return { result: regex.test(control.value), message: ' is not valid'};
      },

      falsy: function(control, params) {
        const regex = /^(?:1|t(?:rue)?|y(?:es)?|ok(?:ay)?|on)$/i;
        return { result: !regex.test(control.value), message: ' is not valid'};
      },

      medium: function(control, params) {
        const regex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
        return { result: regex.test(control.value), message: ' must be 6 characters long and include at least one number'};
      },

      strong: function(control, params) {
        const regex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}))|((?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,}))|((?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})))(?=.{6,})");
        return { result: regex.test(control.value), message: ' must be 8 characters long and include at least one number and special character'};
      },

      confirmed: function(control, params) {
        let group, match;
        if (group = control.parent) {
          match = group.value[params];
        }
        return { result: match == control.value, message: ' must be the same as ' + params};
      },

      different: function(control, params) {
        let group, match;
        if (group = control.parent) {
          match = group.value[params];
        }
        return { result: match != control.value, message: ' cannot be the same as ' + params};
      },

      regex: function(control, params) {
        const regex = new RegExp(params);
        return { result: regex.test(control.value), message: ' does not match the given pattern'};
      },

      not_regex: function(control, params) {
        const regex = new RegExp(params);
        return { result: !regex.test(control.value), message: ' must not match the given pattern'};
      },

      size: function(control, params) {
        let test = control.value.length == params;
        let string = params + ' characters in length ';
        if (+control.value){
          string = ' equal to ' + params;
          test = control.value == params;
        }
        return { result: test, message: ' must be ' + string };
      },

      cc: function(control, params) {
        let value = control.value.replace(/\s|\-|\_/g, '');
        let i = value.length, sum = 0, mul = 1, ca;
        if (i < 12)  return { result: false, message: ' is not a valid credit card'};
        while (i--) {
          ca = value.charAt(i) * mul;
          sum += ca - ((ca > 9) ? 1 : 0) * 9;
          mul ^= 3;
        }
        return { result: (sum % 10 === 0) && (sum > 0), message: ' must be a valid credit card number'};
      },
    }

    private factory(type, params = ''): ValidatorFn {
      return (control: AbstractControl): {[key: string]: any} => {
        let test = this.tests[type](control, params);
        return !test.result ? {[type]: {value: control.value, message: test.message}} : null;
      };
    }

    getValidators(rules = null) {
      if (!rules) return;
      let validators = rules.split('|');

      validators.forEach((rule, i) => {
        let args = rule.split(':');
        validators[i] = (<any>this.factory)(...args);
      });

      return validators;
    }

    setValidator(template) {
      this.tests[template.name] = function(control, params) {
        return { result: template.test, message: template.message }
      }
    }

}
