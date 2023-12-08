import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../interfaces/post';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../service/posts.service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate';

@Component({
  selector: 'post-form',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent implements CanComponentDeactivate {
@Output () publishedPost = new EventEmitter<Post>();
#postService = inject (PostsService);
#router = inject (Router);
saved : boolean = false;

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

  newPost: Post = {
    mood: 0,
    image: "",
    likes: null,
    title: "",
    description: "",
    id: 0,
    date: '',
    place: "",
      lat : 0,
      lng : 0
  };
  imageName = "";

  canDeactivate(){
    return this.saved || confirm ("Do you want to leave this peage losting the data?")
  }
  changeImage (event:Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files||fileInput.files.length===0) return;
    const reader = new FileReader ();
    reader.readAsDataURL ( fileInput.files[0]);
    reader.addEventListener('loadend', ()=>{
      this.newPost.image = reader.result as string;
    });
  }

  addPost() {
    this.newPost.date = this.dateToString(new Date);
    this.newPost.mood= +this.newPost.mood;
    //this.publishedPost.emit (this.newPost);

    //this.imageName = '';
    //this.resetPost();
    this.#postService.addPost(this.newPost)
    .subscribe({
      next: (post)=>{ console.log("added:"+post);
                      this.saved = true; },
      error: (error)=> {
          console.error ("No added **"+error);
          this.imageName="";
          this.newPost.image="";
          alert ('Not added');},
      complete: ()=>  this.#router.navigate (['/posts'])
    });

  }

  private dateToString (dateOrg : Date) : string {
    const formatDate = new Intl.DateTimeFormat('en-US', {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    } );
    return formatDate.format(dateOrg);

  }
}
