import { ResolveFn, Router } from '@angular/router';
import { PostsService } from '../service/posts.service';
import { EMPTY, catchError } from 'rxjs';
import { inject } from '@angular/core';
import { Post } from '../interfaces/post';

export const postResolver: ResolveFn<Post> = (route, state) => {

  return inject(PostsService).getPost (+route.params['id']).pipe(
    catchError((error)=>{
      console.error(error);
      inject(Router).navigate(['/posts']);
      return EMPTY;
    }
    )
  )
};
