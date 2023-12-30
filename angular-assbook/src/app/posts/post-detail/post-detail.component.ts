import { Component, Input, OnInit, inject, } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../services/posts.service';
import { PostCardComponent } from '../post-card/post-card.component';
import { Title } from '@angular/platform-browser';
import { Post } from '../../interfaces/post';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, NonNullableFormBuilder, Validators } from '@angular/forms';
import { CommentInsert, CommentPost } from '../../interfaces/comment';
import { CommentCardComponent } from '../comment-card/comment-card.component';

@Component({
  selector: 'post-detail',
  standalone: true,
  imports: [CommonModule,PostCardComponent, CommentCardComponent,ReactiveFormsModule],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit{
  #postsService = inject (PostsService);
  #router = inject (Router);
  #titleService = inject (Title);
  #formBuilder = inject(NonNullableFormBuilder);

  @Input () post!: Post

  /*  This it's not necessary because Resolver, see routes
  @Input ({transform: numberAttribute}) id!:number;
  item!: Post;
*/
item!:Post;
listComments! : CommentPost [];

commentForm = this.#formBuilder.group ({
  comment: ['',[Validators.minLength(2), Validators.required]]
})

  ngOnInit(): void {
    this.item = this.post;
    this.#titleService.setTitle("Posts|Detail");
    this.#postsService.getComments (this.item.id)
      .subscribe ({
        next: (result)=>this.listComments = result.comments,
        error:  ()=>this.listComments= [],
      });
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

  validClasses(
    formControl: FormControl,
    validClass: string,
    errorClass: string
  ) {
    return {
      [validClass]: formControl.touched && formControl.valid,
      [errorClass]: formControl.touched && formControl.invalid,
    };
  }

  async addComment () {
    alert("Agregar comentario");
   const newComment : CommentInsert ={ text: this.commentForm.controls.comment.value };
    this.#postsService.addComment(this.item.id, newComment).subscribe ({
      next: ()=> {
        this.#postsService.getComments (this.item.id)
        .subscribe ({
          next: (result)=>this.listComments = result.comments,
          error:  ()=>this.listComments= [],
        });
      },
      error: ((error)=>console.error (error))
    });

    //this.listComments=[newComment,...this.listComments];
    this.commentForm.get('comment')?.setValue('');
    this.commentForm.reset;

  }

}
