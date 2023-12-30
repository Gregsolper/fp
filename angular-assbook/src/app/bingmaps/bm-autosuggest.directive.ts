import { Directive, EventEmitter, Injector, Input, OnInit, Output, effect, inject } from '@angular/core';
import { BmMapDirective } from './bm-map.directive';
import { Coordinates } from './coordinates';
import { LoadBingmapsService } from './load-bingmaps.service';

@Directive({
  selector: 'bm-autosuggest',
  standalone: true,
})
export class BmAutosuggestDirective implements OnInit {
  #bmMap = inject(BmMapDirective);
  #loadService = inject(LoadBingmapsService);
  #autoSuggestMgr?: Microsoft.Maps.AutosuggestManager;
  #injector = inject(Injector);

  @Output() locationChanged = new EventEmitter<Coordinates>();
  @Input({required: true}) idInput!: string;
  @Input({required: true}) idContainer!: string;

  ngOnInit(): void {
    effect(async () => {
      if (this.#bmMap.map()) {
        // Map present -> Create marker
        this.#autoSuggestMgr = await this.#loadService.getAutoSuggestManager(
          this.#bmMap.map()!
        );
        this.#autoSuggestMgr.attachAutosuggest(
          '#' + this.idInput,
          '#' + this.idContainer,
          (result) => {
            this.locationChanged.emit(result.location);
          }
        );
      }
    }, {injector: this.#injector});
  }
}
