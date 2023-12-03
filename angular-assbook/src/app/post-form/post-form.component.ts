import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../interfaces/post';
import { FormsModule } from '@angular/forms';
import { User } from '../interfaces/user';

@Component({
  selector: 'post-form',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css'
})
export class PostFormComponent {
@Output () publishedPost = new EventEmitter<Post>();

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
  nuevoUsuario : User = {
    name: '',
    email: '',
    avatar: '',
    lat: 0,
    lng: 0
  };
  newPost: Post = {
    mood: 0,
    image: "",
    likes: null,
    title: "",
    description: "",
    id: 0,
    date: '',
    totalLikes: 0,
    creator: this.nuevoUsuario,
    mine: false
  };
  imageName = "";

  changeImage (event:Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files||fileInput.files.length===0) return;
    const reader = new FileReader ();
    reader.readAsDataURL ( fileInput.files[0]);
    reader.addEventListener('loadend', (e)=>{
      this.newPost.image = reader.result as string;
    });
  }


  private resetPost() {
    this.newPost = {
      mood: 0,
      image: "",
      likes: null,
      title: "",
      description: "",
      id: 0,
      date: '',
      totalLikes: 0,
      creator: this.nuevoUsuario,
      mine: false
    };


  }

  addPost() {

    this.newPost.date = this.dateToString(new Date);
    this.publishedPost.emit (this.newPost);

    this.imageName = '';
    this.resetPost();
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
