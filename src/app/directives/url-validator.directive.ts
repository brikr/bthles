import {Directive} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';
import {isURL as isUrl} from 'validator';


@Directive({
  selector: '[validUrl]',
  providers: [
    {provide: NG_VALIDATORS, useExisting: UrlValidatorDirective, multi: true}
  ],
})
export class UrlValidatorDirective implements Validator {
  private isUrlOptions = {
    // Don't require a protocol, but if one is used, it must be http or https
    protocols: ['http', 'https'],
  };

  validate(control: AbstractControl): ValidationErrors|null {
    if (control.value !== null && !isUrl(control.value, this.isUrlOptions)) {
      return {invalidUrl: true};
    }
    return null;
  }
}
