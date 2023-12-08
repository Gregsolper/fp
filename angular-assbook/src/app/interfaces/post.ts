//import { User } from "./user";
/*
export interface PostInsert {
    title?: string;
    description?: string;
    image?: string;
    place?: string;
    lat?: number;
    lng?: number;
    mood: number;
}

export interface Post extends PostInsert {
    id: number;
    date: string;
    totalLikes: number;
    creator: User;
    likes: boolean | null;
    mine: boolean;
}
*/

export interface Post {
      id: number;
      title: string;
      description: string;
      date : string;
      image :string;
      place: string | null;
      lat : number | null;
      lng : number | null;
      mood : number;
      likes : boolean | null;
  }

  export interface Like {
    likes: boolean | null;
  }
