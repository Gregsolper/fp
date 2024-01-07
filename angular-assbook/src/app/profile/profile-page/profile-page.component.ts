import { PostCardComponent } from './../../posts/post-card/post-card.component';
import { Component, Input, OnInit, Query, inject } from '@angular/core';
import { UserResponse } from '../../interfaces/responses';
import { Title } from '@angular/platform-browser';
import { User, UserAvatarEdit } from '../../interfaces/user';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditProfileModalComponent } from '../modals/edit-profile-modal/edit-profile-modal.component';
import { EditPassModalComponent } from '../modals/edit-pass-modal/edit-pass-modal.component';
import { UserService } from '../../services/user.service';
import { RouterLink } from '@angular/router';
import { Coordinates } from '../../bingmaps/coordinates';
import { BmMapDirective } from '../../bingmaps/bm-map.directive';
import { BmMarkerDirective } from '../../bingmaps/bm-marker.directive';
import { ProfileDetailComponent } from '../profile-detail/profile-detail.component';
import { Post } from '../../interfaces/post';
import { PostsService } from '../../services/posts.service';
import { TrueFalseModalComponent } from '../../modals/true-false-modal/true-false-modal.component';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';
import { PostFilterPipe } from '../../posts/pipes/post-filter.pipe';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [
    RouterLink,
    BmMapDirective,
    BmMarkerDirective,
    ProfileDetailComponent,
    PostCardComponent,
    TrueFalseModalComponent,
    InfoModalComponent,
    PostFilterPipe,
    FormsModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent implements OnInit {
  #titleService = inject(Title);
  #modalService = inject(NgbModal);
  #profileService = inject(UserService);
  #postService = inject(PostsService);

  @Input() userResponse!: UserResponse;

  search?: string;
  profile!: User;
  editAvatar: boolean = false;
  imageName = '';
  coordinates: Coordinates = {
    latitude: 38.3245,
    longitude: -0.5,
  };
  usersFollowing: User[] = [];
  usersFollowers: User[] = [];
  profilePosts: Post[] = [];
  following: boolean = false;

  ngOnInit(): void {
    this.#titleService.setTitle('Profile');
    this.profile = this.userResponse.user;
    this.imageName = this.profile.avatar;

    this.coordinates.latitude = this.profile.lat;
    this.coordinates.longitude = this.profile.lng;
    if (this.profile.me) {
      this.#profileService.getUsersFollowingMe().subscribe({
        next: (users) => {
          this.usersFollowing = users.followed;
          console.log(this.usersFollowing);
        },
        error: (error) => {
          console.log(error.message);
        },
      });
      this.#profileService.getUsersIFollow().subscribe({
        next: (users) => {
          this.usersFollowers = users.followers;
          console.log(this.usersFollowers);
        },
        error: (error) => {
          console.log(error.message);
        },
      });
    } else {
      this.#profileService.checkFollowing(this.profile.id || 0).subscribe({
        next: (result) => {
          this.following = result.following;
        },
      });
    }
    if (this.profile.id) {
      this.#postService.getPostsCreator(this.profile.id).subscribe({
        next: (posts) => {
          this.profilePosts = posts;
        },
        error: (error) => {
          console.log('**Error get Posts Profile');
          console.error(error);
        },
      });
    }
  }

  enableEditAvatar() {
    alert('enable');
    this.editAvatar = true;
  }

  async editProfile() {
    const modalRef = this.#modalService.open(EditProfileModalComponent);
    modalRef.componentInstance.profile = this.profile;
    return modalRef.result.catch(() => false);
  }

  async editPassword() {
    const modalRef = this.#modalService.open(EditPassModalComponent);
    modalRef.componentInstance.profile = this.profile;
    return modalRef.result.catch(() => false);
  }

  changeImage(event: Event) {
    this.imageName = '';

    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files || fileInput.files.length === 0) return;
    const reader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', () => {
      this.imageName = reader.result as string;
      const newAvatar: UserAvatarEdit = {
        avatar: this.imageName,
      };
      this.#profileService.saveAvatar(newAvatar).subscribe({
        next: (r) => {
          console.log(r);
        },
      });
    });
  }

  callToShowPosts() {
    //this.#router.navigate([`/posts/${this.item.id}/edit`]),
    alert('call');
  }
  wantFollow() {
    this.#profileService.wantFollow(this.profile.id || 0).subscribe({
      next: () => {
        this.following = true;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  wantStopFollow() {
    this.#profileService.deleteFollow(this.profile.id || 0).subscribe({
      next: () => {
        this.following = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  deletePost(idToDelete: number | undefined) {
    if (idToDelete) {
      // ask
      const modalRef = this.#modalService.open(TrueFalseModalComponent);
      modalRef.componentInstance.title = 'Erasing post';
      modalRef.componentInstance.body = 'Do you want to delete it?';
      modalRef.result
        .then((resultado) => {
          if (resultado === true) {
            this.profilePosts = this.profilePosts.filter((post) => post.id != idToDelete);
            this.#postService.deletePost(idToDelete).subscribe({
              error: (error) => {
                const modalInfo = this.#modalService.open(InfoModalComponent);
                modalInfo.componentInstance.Title = 'Error triying to delete!';
                modalInfo.componentInstance.body = error.message;
                console.error(error);
              },
            });
          }
        })
        .catch(() => false);
    }
  }
}
