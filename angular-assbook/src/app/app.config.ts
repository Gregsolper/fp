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
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([baseUrlInterceptor, authInterceptor])),
    provideFacebookId('APP_ID', 'v15.0'),
    provideBingmapsKey('AmCsCCqcPEgBpcQEt-j_fZpvSQ_GhKqyvzOk1UiIb3vd1l1Usz51mj-K1uB9hvxl'),
    provideGoogleId('1002957697747-v0fevraaubhn6dl6g2a474l92k2b0cg3.apps.googleusercontent.com') // GOOGLE_PROYECT_ID
    ,
    provideAnimations(),
    provideAnimations()
]
};
