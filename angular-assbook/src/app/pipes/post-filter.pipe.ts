import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../interfaces/post';

@Pipe({
  name: 'postFilter',
  standalone: true
})
export class PostFilterPipe implements PipeTransform {

  transform(posts: Post[], search? : string): Post[] {
    const searchLower = search?.toLocaleLowerCase();
    return  searchLower ? posts.filter(post=>
      post.description?.toLocaleLowerCase().includes(searchLower)||
      post.title?.toLocaleLowerCase().includes(searchLower))
    : posts;
  }

}
