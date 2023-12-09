import { SERVER } from "../../constants";
import { TokenResponse, UserResponse } from "../interfaces/responses";
import { UserLogin, User } from "./../interfaces/user";
import { HttpService } from "./http.service";
// Student: Gregorio Solís Pérez
// 11893345
// November 2023
export class AuthService {
    #http = new HttpService();

    /**
     *
     * POST to login return TOKEN
     *
     * @param userLogin
     * @returns TokenResponse
     * @see userLogin interface
     * @see TokenResponse response
     * @link \interfaces\user.ts
     * @link \interface\responses.ts
     */
    async login(userLogin: UserLogin): Promise<TokenResponse> {
        return this.#http.post<TokenResponse, UserLogin>(
            `${SERVER}/auth/login`,
            userLogin
        );
    }

    /**
     *
     * Post create a new User
     *
     * @param user : new user data
     * @returns User
     * @see User interface
     * @link \interfaces\user.ts
     *
     */
    async register(user: User): Promise<User> {
        const resp = await this.#http.post<UserResponse, User>(
            `${SERVER}/auth/register`,
            user
        );
        return resp.user;
    }

    /**
     * Revie if token is valid.
     * uses variable in localStorage
     * @returns true or false
     */
    async checkToken(): Promise<boolean> {
        if (localStorage.getItem("token")) {
            return await this.#http.get<boolean>(`${SERVER}/auth/validate`);
        } else return false;
    }

    /**
     * Logout
     */
    logout(): void {
        window.location.href = "login.html";
        localStorage.removeItem("token");

    }
}
