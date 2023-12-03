import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import {PostsResponse, SinglePostResponse, LikeResponse,CommentsResponse, CommentResponse} from '../interfaces/responses';
import { SERVER } from '../constants';
import { CommentInsert } from '../interfaces/comment';
import { PostInsert } from '../interfaces/post';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  #http = new HttpService();

  constructor() {

  }

   /**
     *
     * GET all posts using http service
     *
     * @returns  All posts : PostsResponse
     * @see PostsResponse
     * @link \interfaces\responses.ts
     *
     */
   async getAll(): Promise<PostsResponse> {
    return this.#http.get<PostsResponse>(`${SERVER}/posts`);
}

/**
 *
 * GET a single Post.
 *
 * @param postId Post's identification : number
 * @returns SinglePostResponse
 * @see SinglePostResponse
 * @link \interfaces\responses.ts
 *
 */
async get(postId: number): Promise<SinglePostResponse> {
    return this.#http.get<SinglePostResponse>(`${SERVER}/posts/${postId}`);
}
/**
 *
 * POST Insert a new Post
 *
 * @param post : PostInsert
 * @returns PostsResponse
 * @see PostInsert
 * @see PostInsert
 * @link \interfaces\posts.ts
 * @link \interfaces\responses.ts
 *
 */
async post(post: PostInsert): Promise<PostsResponse> {
    return this.#http.post<PostsResponse, PostInsert>(
        `${SERVER}/posts`,
        post
    );
}

/**
 *
 * DELETE remove a post from Database
 *
 * @param postId Post's identification : number
 * @returns void
 */
async delete(postId: number): Promise<void> {
    return this.#http.delete<void>(`${SERVER}/posts/${postId}`);
}

/**
 *
 * POST to give a like or dislike
 *
 * @param postId Post's identification : number
 * @param vote
 * @returns LikeResponse
 * @see LikeResponse
 * @link \interfaces\responses.ts
 *
 */
async postVote(postId: number, vote: boolean): Promise<LikeResponse> {
    return this.#http.post(`${SERVER}/posts/${postId}/likes`, {
        likes: vote,
    });
}
/**
 *
 * DELETE a post
 *
 * @param postId Post's identification : number
 * @returns LikeResponse
 * @see LikeResponse
 * @link \interfaces\responses.ts
 */
async deleteVote(postId: number): Promise<LikeResponse> {
    return this.#http.delete(`${SERVER}/posts/${postId}/likes`);
}

/**
 *
 * GET all comments of one Post
 *
 * @param postId : number id Post
 * @returns CommentsResponse
 * @see CommentResponse
 * @link /interfaces/responses.ts
 *
 */
async getComments(postId: number): Promise<CommentsResponse> {
    return this.#http.get(`${SERVER}/posts/${postId}/comments`);
}
/**
 *
 * POST add a commento to a Post
 *
 * @param postId : number
 * @param comment : CommentInsert
 * @returns CommentResponse
 * @see CommentInsert
 * @see CommentResponse
 * @link /interfaces/comments.ts
 * @link /interfaces/responses.ts
 *
 */
async addComment(postId: number, comment: CommentInsert): Promise<CommentResponse> {
    return this.#http.post(`${SERVER}/posts/${postId}/comments`, comment);
}



}
