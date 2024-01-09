import { routes } from './../app.routes';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

/**
 * Before the component is activated review if is logged with the AuthService.logged() function
 *
 * @see auth.routes.ts
 * @see profile.routes.ts
 * @see posts.routes.ts
 *
 * @param route not used
 * @param state not used
 * @returns route
 */
export const loginActivateGuard: CanActivateFn = (route, state) => {
  let activated!: boolean;
  inject(AuthService)
    .isLogged()
    .subscribe({
      next: (r) => {
        if (r === true) {
          activated = true;
          return true;
        } else {
          activated = false;
          return inject(Router).createUrlTree(['/auth/login']);
        }
      },
      error: (error) => {
        activated = false;
        console.log('**Error Not logged');
        console.error(error);
        return inject(Router).createUrlTree(['/auth/login']);
      },
    });
  if (activated === true) {
    return true;
  } else {
    return inject(Router).createUrlTree(['/auth/login']);
  }
};
