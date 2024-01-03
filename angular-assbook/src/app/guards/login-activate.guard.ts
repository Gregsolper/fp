import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { inject } from '@angular/core';

export const loginActivateGuard: CanActivateFn = (route, state) => {
  /*
  inject(AuthService).isLogged().pipe (
    map((r)=>{
      console.log(r);
      if (r === true){
        console.log("authservice autoriza----->>>>");
        return true} else {
          console.log("NO autoriza----->>>>");
      return inject(Router).navigate(['/auth/login']);
    }}),
    catchError(()=>{ inject(Router).navigate(['/auth/login']); return EMPTY;} )
  );
  return true;

  */

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
