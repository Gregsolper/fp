import { PostsService } from './../service/posts.service';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../interfaces/post';
import { DatePipePipe } from '../pipes/date-pipe.pipe';
import { FormsModule } from '@angular/forms';
import {  RouterLink } from '@angular/router';

@Component({
  selector: 'post-card',
  standalone: true,
  imports: [CommonModule, DatePipePipe, FormsModule, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() item!: Post;
  @Output() deletedPost = new EventEmitter<void>();
  #postsService= inject(PostsService);

  likeIt ( post : Post) {
    const oldLikes = post.likes;
    if ( post.likes === true ) {
      post.likes = null;
      this.#postsService.deleteVote(post.id)
        .subscribe ({error: ()=>{post.likes = oldLikes;}
      });
    } else {
        post.likes = true;
        this.#postsService.addVote(post.id,true)
        .subscribe ({error: ()=>{post.likes = oldLikes;}
        });
    }
  }

  disLikeIt (post : Post) {
    const oldLikes = post.likes;
    if ( post.likes === false ) {
      post.likes = null;
      this.#postsService.deleteVote(post.id)
        .subscribe ({error: ()=>{post.likes = oldLikes;}
      });

    } else {
      post.likes = false;

        this.#postsService.addVote(post.id,false)
        .subscribe ({error: ()=>{post.likes = oldLikes;}
        });
    }
  }

  informDelete () {
    this.deletedPost.emit();
  }
}
