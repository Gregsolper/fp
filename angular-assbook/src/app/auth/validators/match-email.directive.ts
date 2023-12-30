import { Directive } from '@angular/core';

@Directive({
  selector: '[matchEmail]',
  standalone: true
})
export class MatchEmailDirective {

  constructor() { }

}
