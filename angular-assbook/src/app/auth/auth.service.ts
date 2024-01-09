import { TokenResponse } from '../interfaces/responses';
import { Injectable, inject, signal } from '@angular/core';
import { UserLogin } from '../interfaces/user';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
/**
 * AuthService is a set of funtions to implements server's request
 * from auth propose
 */
export class AuthService {
  // use SIGNAL to inform logged status
  #logged = signal(false);
  // HttpClient Angular service
  #http = inject(HttpClient);

  constructor() {}

  /**
   * inform logged status.  Remember is a signal
   */
  get logged() {
    return this.#logged.asReadonly();
  }
  /**
   * Login a login to Server an request a token
   * save token in local storage and set signal
   * @param data user's information
   * @returns Observable void, emit empty value when is succesful
   */
  login(data: UserLogin): Observable<void> {
    return this.#http.post<TokenResponse>('auth/login', data).pipe(
      map((r) => {
        localStorage.setItem('token', r.accessToken);
        this.#logged.set(true);
      })
    );
  }
  /**
   * Remove Item and set signal in false
   */
  logout() {
    localStorage.removeItem('token');
    this.#logged.set(false);
  }
  /**
   * This review it the there is a valid token and if there is a token in local storage.
   * if both exists return true
   * if both not exist return false
   * if logged() is  false but there is a token.  The token is validate and if it's correct set signal to true, if not false
   * @returns an Observable boolean with true or false
   */

  isLogged(): Observable<boolean> {
    //console.log ("IsLogged beggining");

    if (this.logged() === true && localStorage.getItem('token')) {
      //console.log ("IsLogged logged true and local true");
      return of(true);
    } else if (this.logged() === false && !localStorage.getItem('token')) {
      //console.log ("IsLogged logged false and local false");
      return of(false);
    } else if (this.logged() === false && localStorage.getItem('token')) {
      //console.log ("IsLogged logged false and local true");
      this.#http.get<boolean>('auth/validate').subscribe({
        next: () => {
          //console.log ("IsLogged NEXT TRUE logged set true");
          this.#logged.set(true);
          return of(true);
        },
        error: () => {
          localStorage.removeItem('token');
          //console.log ("IsLogged error local remove");
          return of(false);
        },
      });
    } else {
      return of(false);
    }
    return of(true);
  }
}
