import { Component, Input, OnInit, inject, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../service/posts.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { Title } from '@angular/platform-browser';
import { Post } from '../interfaces/post';
import { Router } from '@angular/router';

@Component({
  selector: 'post-detail',
  standalone: true,
  imports: [CommonModule,PostCardComponent],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit{
  #postsService = inject (PostsService);
  #router = inject (Router);
  #titleService = inject (Title);

  @Input () post!: Post

  /*  This it's not necessary because Resolver, see routes
  @Input ({transform: numberAttribute}) id!:number;
  item!: Post;
*/
item!:Post;

  ngOnInit(): void {
    this.item = this.post;
    this.#titleService.setTitle("Posts|Detail");
    /*  The data is pre-fetching with the Resolver
    if (this.id) {
    this.#postsService
        .getPost (this.id)
        .subscribe ({
          next: (p)=>(this.item = p),
          error: (error)=>{console.error(error);
             console.log(">>>>Not found:"+this.id);
             this.#router.navigate(['/posts']);
            },
        });
      }
    else alert ("No trae dato");
    */
  }

  deletePost (idToDelete:number | undefined){
    if (idToDelete){
      this.#postsService.deletePost(idToDelete).subscribe({
        error: (error)=> console.error (error)  });
    }
  }

  goPosts () {
this.#router.navigate(['/posts']);
  }

}
