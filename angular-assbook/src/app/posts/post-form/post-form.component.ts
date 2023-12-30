import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/post';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { Router } from '@angular/router';
import { CanComponentDeactivate } from '../../interfaces/can-component-deactivate';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrueFalseModalComponent } from '../../modals/true-false-modal/true-false-modal.component';
import { UserService } from '../../services/user.service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'post-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-form.component.html',
  styleUrl: './post-form.component.css',
})
export class PostFormComponent implements OnInit, CanComponentDeactivate {
  @Input() post!: Post;
  @Output() publishedPost = new EventEmitter<Post>();
  #postService = inject(PostsService);
  #userService = inject(UserService);
  #router = inject(Router);
  #formBuilder = inject(NonNullableFormBuilder);
  #modalService = inject(NgbModal);

  saved: boolean = false;
  me!: User;
  imageName = '';
  editMode = false;

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

  ngOnInit(): void {
    if (this.post) {
      this.editMode = true;
      this.postForm.patchValue({
        title: this.post.title,
        description: this.post.description,
        mood: this.post.mood,
      });
      this.imageName = this.post.image || '';
    }
  }
  canDeactivate() {
    // if the form has not been modified
    if (this.postForm.pristine || this.saved === true) {
      return true;
    }
    const modalRef = this.#modalService.open(TrueFalseModalComponent);
    modalRef.componentInstance.title = 'Change not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
    /*
    return (
      this.saved || confirm('Do you want to leave this peage losting the data?')
    );
    */
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
    if (this.editMode) {
      this.updatePost();
    } else {
      if (this.postForm.valid) {
        this.#userService.getMyProfile().subscribe({
          next: (resp) => {
            this.me = resp.user;
          },
        });
        const newPost: Post = {
          ...this.postForm.getRawValue(),
          image: this.imageName,
          id: 0,
          date: this.dateToString(new Date()),
          place: undefined,
          lat: undefined,
          lng: undefined,
          likes: null,
          totalLikes: 0,
          creator: this.me,
          mine: false,
        };
        newPost.mood = +newPost.mood;

        this.#postService.addPost(newPost).subscribe({
          next: (post) => {
            console.log('added:');
            console.log(post);
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
  }

  updatePost () {
    if (this.postForm.pristine) {
      this.#router.navigate(['/posts']);
    }
    if (this.postForm.valid) {
      if (this.postForm.controls.title.dirty){
        this.post.title = this.postForm.get('title')?.value;
      }
      if (this.postForm.controls.description.dirty){
        this.post.description = this.postForm.get('description')?.value;
      }

      if (this.postForm.controls.mood.dirty){
        let newMood = this.postForm.get('mood')?.value || 0;
        newMood = +newMood;
        this.post.mood = newMood;
      }
      if (this.postForm.controls.image.dirty){
        this.post.image = this.imageName;
      }
      console.log("triying");
      console.log(this.post);
      this.#postService.updatePost(this.post).subscribe({
        next: (post) => {
          console.log('updated:');
          console.log (post);
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
