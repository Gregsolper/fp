import { CommentPost } from "./comment";
import { Post } from "./post";
import { User } from "./user";

export interface PostsResponse {
    posts: Post[];
}

export interface SinglePostResponse {
    post: Post;
}

export interface TokenResponse {
    accessToken: string;
}

export interface UserResponse {
    user: User;
}

export interface UsersResponse {
    users: User[];
}

export interface AvatarResponse {
    avatar: string;
}

export interface LikeResponse {
    totalLikes: number;
}

export interface CommentsResponse {
    comments: CommentPost[];
}

export interface CommentResponse {
    comment: CommentPost;
}

export interface CheckFollowResponse {
    following: boolean;
}

export interface FollowedResponse {
  followed: User[];
}

export interface FollowersResponse {
  followers: User[];
}
