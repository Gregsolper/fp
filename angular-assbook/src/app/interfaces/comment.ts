import { Post } from "./post";
import { User } from "./user";

export interface CommentInsert {
    text: string;
}

export interface CommentPost extends CommentInsert {
    id: number;
    text: string;
    date: string;
    post?: Post;
    user: User;
}

