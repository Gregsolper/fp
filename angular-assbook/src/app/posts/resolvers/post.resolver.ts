import { ResolveFn, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { EMPTY, catchError } from 'rxjs';
import { inject } from '@angular/core';
import { Post } from '../../interfaces/post';
/**
 * This function does get before charge the component
 * @param route
 * @returns
 */
export const postResolver: ResolveFn<Post> = (route) => {

  return inject(PostsService).getPost (+route.params['id'])

  .pipe(
    catchError(()=>{

      inject(Router).navigate(['/posts']);
      return EMPTY;
    }
    )
  )
};
