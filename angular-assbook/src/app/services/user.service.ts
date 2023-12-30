import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { User } from '../interfaces/user';
import { UserResponse } from '../interfaces/responses';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  #http = inject (HttpClient);
  userUrl='auth';

  constructor() { }

   /**
     *
     * GET a profile
     *
     * @param id : number Profile id to get
     * @returns UserResponse
     * @see UserResponse
     * @link \interfaces\responses.ts
     *
     */
    /*
   async getProfile (id:number) : Promise<UserResponse>{
    return this.#http.get<UserResponse>(`${SERVER}/users/${id}`);
}*/

/**
 *
 * GET the user's profile
 *
 * @returns UserResponse
 * @see UserResponse
 * @link \interfaces\responses.ts
 *
 */

getMyProfile ():Observable<UserResponse>{
  return this.#http.get<UserResponse>("users/me");
}

// async getMyProfile () : Promise<UserResponse>{
//     return this.#http.get<UserResponse>(`/users/me`);
// }


/**
 *
 * PUT save a new profile
 *
 * @param userDataChange : UserProfileEdit
 * @returns void
 * @see UserProfileEdit
 * @link \interfaces\responses.ts
 *
 */

/*
async saveProfile(userDataChange:UserProfileEdit): Promise<void> {
    return this.#http.put<void,UserProfileEdit> (`${SERVER}/users/me`,userDataChange);
}*/

/**
 *
 * POST Save a new profile
 *
 * @param userForm :User New user data
 * @returns User
 * @see User
 * @link \interfaces\user.ts
 *
 */

registerUser ( user : User): Observable<User>{
  return this.#http
        .post<UserResponse>(`${this.userUrl}/register`,user)
        .pipe(map((resp)=>resp.user))

 }
/*
async registerUser(userForm: User): Promise<User> {
    const resp = await this.#http.post<UserResponse, User>(
        `${SERVER}/auth/register`,
        userForm
    );
    return resp.user;
}*/

/**
 *
 * PUT update avatar image
 *
 * @param avatar :UserAvatarEdit new file
 * @returns AvatarResponse
 * @see
 * @link \interfaces\responses.ts
 *
 */ /*
async saveAvatar (avatar:UserAvatarEdit): Promise<AvatarResponse>{
    return this.#http.put<AvatarResponse,UserAvatarEdit>(`${SERVER}/users/me/avatar`,avatar);
}*/

/**
 *
 * PUT update password
 *
 * @param password :string
 * @returns void
 */  /*
async savePassword(password: string): Promise<void> {
    const passform : UserPasswordEdit= {
        password: password
    };
    return this.#http.put<void,UserPasswordEdit>(`${SERVER}/users/me/password`,passform);
} */

}
