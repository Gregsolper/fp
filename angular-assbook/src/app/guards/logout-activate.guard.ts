import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
/**
 * Review if is logout
 * if true send to auth/login
 * otherwise follow route
 *
 * @param route not used
 * @param state not used
 * @returns true of rout /auth/login
 */
export const logoutActivateGuard: CanActivateFn = (route, state) => {
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
    return inject(Router).createUrlTree(['/posts']);
  } else {
    return true;
  }


};
