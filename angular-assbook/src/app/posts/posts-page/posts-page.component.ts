import { InfoModalComponent } from './../../modals/info-modal/info-modal.component';
import { Component, OnInit, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../../interfaces/post';
import { DatePipePipe } from "../pipes/date-pipe.pipe";
import { PostFormComponent } from '../post-form/post-form.component';
import { PostCardComponent } from '../post-card/post-card.component';
import { PostFilterPipe } from '../pipes/post-filter.pipe';
import { FormsModule } from '@angular/forms';
import { PostsService } from '../../services/posts.service';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrueFalseModalComponent } from '../../modals/true-false-modal/true-false-modal.component';


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
  #router = inject(Router);
  #authServie = inject (AuthService);
  #modalService = inject (NgbModal);

  logged = computed(()=>this.#authServie.logged());

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

  ngOnInit(): void {

    this.#authServie.isLogged().subscribe({
      error: (error)=> {
        console.log('**Error Posts-Page/get-Posts Not logged')
        console.error (error);
        this.#router.navigate(['/auth/login']);
      }
    });

    this.#titleService.setTitle("Posts|All");
    this.#postService.getPosts()
    .subscribe({
      next: (posts)=>(this.posts=posts),
      error: (error)=> {
        console.log('**Error Posts-Page/get-Posts')
        console.error (error);
        this.#router.navigate(['/auth/login']);
      }

    });

  }


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
// ask
      const modalRef = this.#modalService.open(TrueFalseModalComponent);
      modalRef.componentInstance.title ="Erasing post";
      modalRef.componentInstance.body = "Do you want to delete it?"
      modalRef.result.then (resultado =>{
        if (resultado ===true){
          this.posts = this.posts.filter(post => post.id != idToDelete);
          this.#postService.deletePost(idToDelete).subscribe({

            error: (error)=> {
              const modalInfo = this.#modalService.open(InfoModalComponent);
              modalInfo.componentInstance.Title="Error triying to delete!"
              modalInfo.componentInstance.body=error.message;
              console.error (error);}
            });
          }
        }
      ).catch(()=>false);


    }
  }
}
