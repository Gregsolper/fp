import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../post';
import { FormsModule } from '@angular/forms';





@Component({
  selector: 'posts-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.css',
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

  posts: Post[] = [];
  newPost: Post = {
    mood: 0,
    image: "",
    likes: null,
    title:"",
    description:""
  };
  imageName = "";

  numId = 1;
  datePost = this.dateToString(new Date ());



  changeImage (event:Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files||fileInput.files.length===0) return;
    const reader = new FileReader ();
    reader.readAsDataURL ( fileInput.files[0]);
    reader.addEventListener('loadend', (e)=>{
      this.newPost.image = reader.result as string;
    });
  }

  addPost() {
    this.newPost.id = this.numId;
    ++this.numId;
    this.newPost.date = this.datePost;
    this.posts.push(this.newPost);
    this.imageName = '';
    this.resetPost();
  }

  private resetPost() {
    this.newPost = {
      id : 0,
      title :"",
      description: "",
      mood: 0,
      image:"",
      date:"",
      likes: null,
    };
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
}
