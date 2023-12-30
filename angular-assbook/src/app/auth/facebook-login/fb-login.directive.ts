import { Directive, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { LoadFbApiService } from './load-fb-api.service';
@Directive({
  selector: '[fbLogin]',
  standalone: true,
})
export class FbLoginDirective {
  @Output() loginOk = new EventEmitter<fb.StatusResponse>();
  @Output() loginError = new EventEmitter<string>();
  @Input() scopes!: string[];

  #loadService = inject(LoadFbApiService);

  @HostListener('click') async onClick(): Promise<void> {
    try {
      const resp = await this.#loadService.login(this.scopes.join(','));
      this.loginOk.emit(resp);
    } catch (e) {
      this.loginError.emit('Error with Facebook login!');
    }
  }
}
