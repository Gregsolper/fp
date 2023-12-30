import { InjectionToken, Provider } from '@angular/core';

export const BINGMAPS_KEY = new InjectionToken<string>('bingmaps_key');

export function provideBingmapsKey(key: string): Provider {
  return { provide: BINGMAPS_KEY, useValue: key };
}