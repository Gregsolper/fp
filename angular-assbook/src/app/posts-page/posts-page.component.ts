import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../interfaces/post';
import { DatePipePipe } from "../pipes/date-pipe.pipe";
import { PostFormComponent } from '../post-form/post-form.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostFilterPipe } from '../pipes/post-filter.pipe';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../service/posts.service';
import { Title } from '@angular/platform-browser';


@Component({
    selector: 'posts-page',
    standalone: true,
    templateUrl: './posts-page.component.html',
    styleUrl: './posts-page.component.css',
    imports: [CommonModule,
       DatePipePipe,
       FormsModule,
       PostFormComponent,
       PostCardComponent,
      PostFilterPipe]
})


export class PostsPageComponent implements OnInit{

  #postService = inject (PostsService);
  #titleService = inject (Title);


  ngOnInit(): void {
    this.#titleService.setTitle("Posts|All");
    this.#postService.getPosts()
    .subscribe({
      next: (posts)=>(this.posts=posts),
      error: (error)=> console.error (error)  });

  //   .then ((postResp)=> {
  //     this.posts = postResp.posts;
  //   })
  //   .catch((error) => {
  //     alert ("error en la carga"+error.message);
  //     // Swal.fire("Post", error.message, "info");
  // });

  }

  labelForm = {
    headerTitle: 'AssBook',
    title: 'Title',
    description: 'Description',
    photo: 'Photo',
    mood: 'Mood',
    create: 'Create',
    happy: 'Happy',
    neutral: 'Neutral',
    angry: 'Angry',
    warning: "A post can't be empty!",
  };

  search? : string;
  posts: Post[] = [];

  numId = 1;

/**
 * Event tiggerred by postForm
 * @param newPost
 */
  addToPosts( newPost : Post) {

    this.#postService.addPost(newPost)
    .subscribe({

      error: (error)=> console.error (error)  });

    //newPost.id = this.numId;
    //++this.numId;
    this.posts =  [newPost,...this.posts];
  }

  deletePost (idToDelete:number | undefined){
    if (idToDelete){
      this.posts = this.posts.filter(post => post.id != idToDelete);
      this.#postService.deletePost(idToDelete).subscribe({

        error: (error)=> console.error (error)  });

    }
  }
}
