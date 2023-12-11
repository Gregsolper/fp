import { Directive } from '@angular/core';
import {  FormGroup, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[formRequired]',
  standalone: true
})
export class FormRequiredDirective implements Validator{

  constructor() { }
  validate(group: FormGroup) : ValidationErrors | null {
    if (Object.values(group.value).every(v=>v==='')) {
      return { 'formRequired' : true}
    }
    return null;
  }

}
