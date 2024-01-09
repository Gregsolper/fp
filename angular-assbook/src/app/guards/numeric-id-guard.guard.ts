import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
/**
 * Review if the param is a Number
 * if is correct allow to follow the route
 * otherwise is send to /posts
 *
 * @param route if is a numeric follow this route
 * @returns true or the route /posts
 */
export const numericIdGuardGuard: CanActivateFn = (route) => {
  const id = +route.params['id'];
  if ( isNaN(id) || id < 1){
    return inject(Router).createUrlTree(['/posts']);
  }
  return true;
};
