"use strict";

import { Http } from "./http.js";
import { SERVER } from "../constants.js";

export class PostService {
  #http;
  constructor() {
    this.#http = new Http();

  }

  async getall() {
    const response = await this.#http.get(SERVER + "/posts");
    return response.posts;
  }

  async post(body) {
    try {
      const response = await this.#http.post(SERVER + "/posts/", body);
      return response;
    } catch (e) {
      console.log("PostServ/post Error:" + e);
    }
  }

  async postVote(idPost, vote = null) {
    let url = SERVER + "/posts/" + idPost + "/likes";
    let body = Object();
    body.likes = vote;
    // { "likes" : true };

    return this.#http.post(url, body).then((response) => {
      return response;
    });
  }

  async deleteVote(idPost) {
    let url = SERVER + "/posts/" + idPost + "/likes";
    return this.#http.delete(url).then((response) => {
      return response;
    });

  }

  async deletePost(idPost) {
    let url = SERVER + "/posts/" + idPost;
    return this.#http.delete(url).then((response) => {
      return response;
    });
  }
}

