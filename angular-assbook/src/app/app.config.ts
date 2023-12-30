import { BINGMAP_API_KEY, GOOGLE_PROYECT_ID } from './constants';
import { ApplicationConfig } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withPreloading } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { baseUrlInterceptor } from './interceptors/base-url.interceptor';
import { provideGoogleId } from './auth/google-login/google-login.config';
import { authInterceptor } from './interceptors/auth.interceptor';
import { provideFacebookId } from './auth/facebook-login/facebook-login.config';
import { provideBingmapsKey } from './bingmaps/bingmaps.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
                  routes,
                  withComponentInputBinding (),
                  withPreloading(PreloadAllModules)
                  ),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideFacebookId('APP_ID', 'v15.0'),
    provideBingmapsKey(BINGMAP_API_KEY), // Este esta definido en constantes pero tambien en bingmaps.config.ts
    provideGoogleId(GOOGLE_PROYECT_ID),

  ]
};
