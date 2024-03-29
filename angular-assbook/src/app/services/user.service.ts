import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import {
  User,
  UserAvatarEdit,
  UserPasswordEdit,
  UserProfileEdit,
} from '../interfaces/user';
import { AvatarResponse, CheckFollowResponse, FollowedResponse, FollowersResponse, UserResponse } from '../interfaces/responses';
import { SERVER } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  #http = inject(HttpClient);
  userUrl = 'auth';

  constructor() {}

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
  getProfile(id: number): Observable<UserResponse> {
    return this.#http.get<UserResponse>(`users/${id}`);
  }

  /**
   *
   * GET the user's profile
   *
   * @returns UserResponse
   * @see UserResponse
   * @link \interfaces\responses.ts
   *
   */

  getMyProfile(): Observable<UserResponse> {
    return this.#http.get<UserResponse>('users/me');
  }

  // async getMyProfile () : Promise<UserResponse>{
  //     return this.#http.get<UserResponse>(`/users/me`);
  // }

  /**
   *
   * PUT update a new profile
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
  saveProfile(userDataChange: UserProfileEdit): Observable<void> {
    return this.#http.put<void>(`users/me`, userDataChange);
  }

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

  registerUser(user: User): Observable<User> {
    return this.#http
      .post<UserResponse>(`${this.userUrl}/register`, user)
      .pipe(map((resp) => resp.user));
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
  saveAvatar(avatar: UserAvatarEdit): Observable<string> {
    return this.#http
      .put<AvatarResponse>(`users/me/avatar`, avatar)
      .pipe(map((resp) => resp.avatar));
  }

  /**
   *
   * PUT update password
   *
   * @param password :string
   * @returns void
   */ /*
async savePassword(password: string): Promise<void> {
    const passform : UserPasswordEdit= {
        password: password
    };
    return this.#http.put<void,UserPasswordEdit>(`${SERVER}/users/me/password`,passform);
} */
  savePassword(password: string): Observable<void> {
    const passform: UserPasswordEdit = {
      password: password,
    };
    return this.#http.put<void>(`users/me/password`, passform);
  }

  getUsersFollowingMe(): Observable<FollowedResponse> {
    return this.#http.get<FollowedResponse>(`users/me/following`);
  }

  getUsersIFollow(): Observable<FollowersResponse> {
    return this.#http.get<FollowersResponse>(`users/me/followers`);
  }

  getUsersFollowing(id:number): Observable<FollowedResponse> {
    return this.#http.get<FollowedResponse>(`users/${id}/following`);
  }

  getUsersFollow(id:number): Observable<FollowersResponse> {
    return this.#http.get<FollowersResponse>(`users/${id}/followers`);
  }

  checkFollowing (id: number): Observable<CheckFollowResponse>{
    return this.#http.get<CheckFollowResponse>(`users/${id}/follow`);
  }
  wantFollow (id:number) : Observable<void>{
    return this.#http.post<void>(`users/${id}/follow`,'');
  }

  deleteFollow (id:number) : Observable<void>{
    return this.#http.delete<void>(`users/${id}/follow`);
  }
}
