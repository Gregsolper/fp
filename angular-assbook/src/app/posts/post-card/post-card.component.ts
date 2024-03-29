import { PostsService } from '../../services/posts.service';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/post';
import { DatePipePipe } from '../pipes/date-pipe.pipe';
import { FormsModule } from '@angular/forms';
import {  Router, RouterLink } from '@angular/router';

@Component({
  selector: 'post-card',
  standalone: true,
  imports: [CommonModule, DatePipePipe, FormsModule, RouterLink],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent implements OnInit {
  @Input() item!: Post;
  @Output() deletedPost = new EventEmitter<void>();
  @Output() editPost = new EventEmitter<void>();
  #postsService= inject(PostsService);
  #router = inject (Router);
  totalLikes = 0;

  ngOnInit(): void {
    this.totalLikes = this.item.totalLikes || 0;
  }

  likeIt ( post : Post) {
    const oldLikes = post.likes;
    if ( post.likes === true ) {
      post.likes = null;
      this.#postsService.deleteVote(post.id)
        .subscribe ({
          next: (result)=>this.totalLikes = result.totalLikes,
          error: ()=>{post.likes = oldLikes;}
      });
    } else {
        post.likes = true;
        this.#postsService.addVote(post.id,true)
        .subscribe ({
          next: (result)=>this.totalLikes = result.totalLikes,
          error: ()=>{post.likes = oldLikes;}
        });
    }
  }

  disLikeIt (post : Post) {
    const oldLikes = post.likes;
    if ( post.likes === false ) {
      post.likes = null;
      this.#postsService.deleteVote(post.id)
        .subscribe ({
          next: (result)=>this.totalLikes = result.totalLikes,
          error: ()=>{post.likes = oldLikes;}
      });

    } else {
      post.likes = false;

        this.#postsService.addVote(post.id,false)
        .subscribe ({
          next: (result)=>this.totalLikes = result.totalLikes,
          error: ()=>{post.likes = oldLikes;}
        });
    }
  }

  informDelete () {
    this.deletedPost.emit();
  }

  informEdit () {
    this.#router.navigate([`/posts/${this.item.id}/edit`]),
    this.editPost.emit();
  }
}
