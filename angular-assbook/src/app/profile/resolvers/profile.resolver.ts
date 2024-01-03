import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user.service';
import { UserResponse } from '../../interfaces/responses';

export const profileResolver: ResolveFn<UserResponse> = (route) => {
  const id = +route.params['id'];
  //if ( isNaN(id) || id < 1){
  //  return inject(Router).createUrlTree(['/posts']);
  //}
  if (id) {
    return inject(UserService)
      .getProfile(+route.params['id'])
      .pipe(
        catchError(() => {
          inject(Router).navigate(['/posts']);
          return EMPTY;
        })
      );
  }
  return inject(UserService)
      .getMyProfile()
      .pipe(
        catchError(() => {
          inject(Router).navigate(['/posts']);
          return EMPTY;
        })
      );
};
