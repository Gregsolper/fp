import { TokenResponse } from '../interfaces/responses';
import { Injectable, inject, signal } from '@angular/core';
import { UserLogin } from '../interfaces/user';
import { Observable, map, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  #logged=signal (false);
  #http=inject(HttpClient);

  constructor() { }

  get logged() {
    return this.#logged.asReadonly();
  }

  login (data:UserLogin):Observable<void>{
    return this.#http.post<TokenResponse> ('auth/login',data)
      .pipe(map(r=>{
        localStorage.setItem("token",r.accessToken);
        this.#logged.set(true);
      }));
  }

  logout(){
    localStorage.removeItem("token");
    this.#logged.set(false);
  }


  isLogged () : Observable<boolean> {
      console.log ("IsLogged beggining");

      if(this.logged()===true && localStorage.getItem("token")){
        console.log ("IsLogged logged true and local true");
        return of(true);

      } else if (this.logged()===false && !localStorage.getItem("token")) {
        console.log ("IsLogged logged false and local false");
        return of (false);

      } else if (this.logged()=== false && localStorage.getItem("token")){
        console.log ("IsLogged logged false and local true");
        this.#http.get<boolean>("auth/validate").subscribe ({
          next: ()=>{
            console.log ("IsLogged NEXT TRUE logged set true");
              this.#logged.set(true);
              return of(true);
             },
         error: (()=>{localStorage.removeItem("token");
         console.log ("IsLogged error local remove");
                 return of (false);
                })
         });

      } else {
        return of (false);
      }
      return of (true);
  }

}


