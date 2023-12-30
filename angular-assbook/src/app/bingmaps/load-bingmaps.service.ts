import { Injectable, inject } from '@angular/core';
import { Coordinates } from './coordinates';
import { BINGMAPS_KEY } from './bingmaps.config';

interface AutoSuggestOptions extends Microsoft.Maps.IAutosuggestOptions {
  businessSuggestions: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LoadBingmapsService {
  #apiLoader: Promise<void>;
  #autoSuggestLoader: Promise<void> | null = null;
  #mapsKey = inject(BINGMAPS_KEY, { optional: true });

  private constructor() {
    if (this.#mapsKey === null) {
      throw new Error(
        'LoadBingmapsService: You must call provideBingmapsKey in your providers array'
      );
    }
    this.#apiLoader = this.#loadBingApi();
  }

  #loadBingApi(): Promise<void> {
    const script = document.createElement('script');
    script.src = 'https://www.bing.com/api/maps/mapcontrol?callback=showMap';
    script.defer = true;
    document.body.append(script);

    return new Promise<void>((resolve, reject) => {
      (window as unknown as { showMap: () => void }).showMap = (): void => {
        resolve();
      };
      script.addEventListener('error', () =>
        reject('Bing API could not be loaded')
      );
    });
  }

  #loadAutoSuggest(): Promise<void> {
    return new Promise<void>((resolve) => {
      Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', () => {
        resolve();
      });
    });
  }

  async createMap(
    coords: Coordinates,
    divMap: HTMLElement
  ): Promise<Microsoft.Maps.Map> {
    await this.#apiLoader;

    return new Microsoft.Maps.Map(divMap, {
      credentials: this.#mapsKey!,
      center: new Microsoft.Maps.Location(coords.latitude, coords.longitude),
      mapTypeId: Microsoft.Maps.MapTypeId.road,
      zoom: 13,
    });
  }

  async createMarker(
    map: Microsoft.Maps.Map,
    coords: Coordinates,
    color = 'red'
  ): Promise<Microsoft.Maps.Pushpin> {
    const pin = new Microsoft.Maps.Pushpin(
      new Microsoft.Maps.Location(coords.latitude, coords.longitude),
      { color }
    );
    map.entities.push(pin);

    return pin;
  }

  async getAutoSuggestManager(
    map: Microsoft.Maps.Map
  ): Promise<Microsoft.Maps.AutosuggestManager> {
    if (!this.#autoSuggestLoader) { // First time (null)
      this.#autoSuggestLoader = this.#loadAutoSuggest();
    }
    await this.#autoSuggestLoader;

    return new Microsoft.Maps.AutosuggestManager({
      map: map,
      placeSuggestions: true,
      addressSuggestions: true,
      businessSuggestions: true,
    } as AutoSuggestOptions);
  }
}