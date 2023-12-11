import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../interfaces/post';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { PostsService } from '../service/posts.service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../interfaces/can-component-deactivate';

@Component({
  selector: 'post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent implements CanComponentDeactivate {
  @Output() publishedPost = new EventEmitter<Post>();
  #postService = inject(PostsService);
  #router = inject(Router);
  #formBuilder = inject(NonNullableFormBuilder);

  saved: boolean = false;

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

  postForm = this.#formBuilder.group({
    title: [
      '',
      [Validators.minLength(5), Validators.pattern('^[a-zA-Z][a-zA-Z ]*$')],
    ],
    description: ['', [Validators.minLength(8)]],
    image: '',
    mood: [0, [Validators.required, Validators.min(0), Validators.max(2)]],
  });

  imageName = '';

  canDeactivate() {
    // if the form has not been modified
    if (this.postForm.pristine) this.saved = true;
    return (
      this.saved || confirm('Do you want to leave this peage losting the data?')
    );
  }
  changeImage(event: Event) {
    this.imageName = '';
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageName = reader.result as string;
    });
  }

  addPost() {
    if (this.postForm.valid) {
      const newPost: Post = {
        ...this.postForm.getRawValue(),
        image: this.imageName,
        id: 0,
        date: this.dateToString(new Date()),
        place: null,
        lat: null,
        lng: null,
        likes: null,
      };

      this.#postService.addPost(newPost).subscribe({
        next: (post) => {
          console.log('added:' + post);
          this.saved = true;
        },
        error: (error) => {
          console.error('No added **' + error);
          this.imageName = '';
          //this.newPost.image="";
          alert('Not added');
        },
        complete: () => this.#router.navigate(['/posts']),
      });
    }
  }

  private dateToString(dateOrg: Date): string {
    const formatDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });
    return formatDate.format(dateOrg);
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

  formRequired(): boolean {
    if (
      this.postForm.controls.title.value === '' &&
      this.postForm.controls.description.value === '' &&
      this.postForm.controls.image.value === ''
    )
      return true;
    else return false;
  }
}
