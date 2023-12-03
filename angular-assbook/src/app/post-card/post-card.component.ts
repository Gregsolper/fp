import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../interfaces/post';
import { DatePipePipe } from '../pipes/date-pipe.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'post-card',
  standalone: true,
  imports: [CommonModule, DatePipePipe, FormsModule],
  templateUrl: './post-card.component.html',
  styleUrl: './post-card.component.css'
})
export class PostCardComponent {
  @Input() item!: Post;
  @Output() deletedPost = new EventEmitter<void>();


  likeIt ( post : Post) {
    if ( post.likes === true ) {
      post.likes = null;
    } else {
      post.likes = true;
    }
  }

  disLikeIt (post : Post) {
    if ( post.likes === false ) {
      post.likes = null;
    } else {
      post.likes = false;
    }
  }

  informDelete () {
    this.deletedPost.emit();
  }
}
