import { Like, Post } from '../interfaces/post';
import { Injectable, inject } from '@angular/core';
import { CommentResponse, CommentsResponse, LikeResponse, PostsResponse, SinglePostResponse} from '../interfaces/responses';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { CommentInsert } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  //#http = new HttpService();
  #http = inject (HttpClient);
  postUrl='posts';
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

   getPosts () : Observable<Post[]> {
    return this.#http
      .get<PostsResponse>(this.postUrl)
      .pipe(map((resp=>resp.posts)));
   }
/*
   async getAll(): Promise<PostsResponse> {
    return this.#http.get<PostsResponse>(`${SERVER}/posts`);
  }
*/
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
getPost (id:number) : Observable<Post> {

  return this.#http
    .get<SinglePostResponse>(`${this.postUrl}/${id}`)
    .pipe(map((resp=>resp.post)));
}
// async get(postId: number): Promise<SinglePostResponse> {
//     return this.#http.get<SinglePostResponse>(`${SERVER}/posts/${postId}`);
// }
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
addPost(post:Post):Observable<Post>{
  return this.#http
    .post<SinglePostResponse>(`${this.postUrl}`,post)
    .pipe(map((resp)=>resp.post));
}

updatePost(post:Post):Observable<Post>{
  return this.#http
    .put<SinglePostResponse>(`${this.postUrl}/${post.id}`,post)
    .pipe(map((resp)=>resp.post));
}

// async post(post: PostInsert): Promise<PostsResponse> {
//     return this.#http.post<PostsResponse, PostInsert>(
//         `${SERVER}/posts`,
//         post
//     );
// }

/**
 *
 * DELETE remove a post from Database
 *
 * @param postId Post's identification : number
 * @returns void
 */

deletePost(id:number):Observable<void>{
  return this.#http.delete<void>(`${this.postUrl}/${id}`);
}
// async delete(postId: number): Promise<void> {
//     return this.#http.delete<void>(`${SERVER}/posts/${postId}`);
// }

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
addVote (id:number,likes:boolean): Observable<LikeResponse>
{
  const body : Like = { "likes": likes};
  return this.#http.post<LikeResponse> (`${this.postUrl}/${id}/likes`,body);
}

// async postVote(postId: number, vote: boolean): Promise<LikeResponse> {
//     return this.#http.post(`${SERVER}/posts/${postId}/likes`, {
//         likes: vote,
//     });
//}
/**
 *
 * DELETE vote's  post
 *
 * @param postId Post's identification : number
 * @returns LikeResponse
 * @see LikeResponse
 * @link \interfaces\responses.ts
 */
deleteVote (id:number): Observable<LikeResponse>{
  return this.#http.delete<LikeResponse>  (`${this.postUrl}/${id}/likes`);
}
// async deleteVote(postId: number): Promise<LikeResponse> {
//     return this.#http.delete(`${SERVER}/posts/${postId}/likes`);
// }

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
// async getComments(postId: number): Promise<CommentsResponse> {
//     return this.#http.get(`${SERVER}/posts/${postId}/comments`);
// }
getComments (postId:number): Observable<CommentsResponse>{
  return this.#http.get<CommentsResponse>(`${this.postUrl}/${postId}/comments`);
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
addComment (postId: number, comment: CommentInsert): Observable<CommentResponse> {
  return this.#http.post<CommentResponse>(`${this.postUrl}/${postId}/comments`, comment);
}
// async addComment(postId: number, comment: CommentInsert): Promise<CommentResponse> {
//     return this.#http.post(`${SERVER}/posts/${postId}/comments`, comment);
// }



}
