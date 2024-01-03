import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

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
