import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../interfaces/post';
import { DatePipePipe } from "../pipes/date-pipe.pipe";
import { PostFormComponent } from '../post-form/post-form.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostFilterPipe } from '../pipes/post-filter.pipe';
import { FormsModule } from '@angular/forms';

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


export class PostsPageComponent {

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

    newPost.id = this.numId;
    ++this.numId;
    this.posts =  [...this.posts,newPost];
  }

  deletePost (idToDelete:number | undefined){
    if (idToDelete)
      this.posts = this.posts.filter(post => post.id != idToDelete);
  }
}
