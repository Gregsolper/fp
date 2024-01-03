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

@Component({
  selector: 'profile-page',
  standalone: true,
  imports: [RouterLink, BmMapDirective,BmMarkerDirective ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit {
  #titleService = inject (Title);
  #modalService = inject(NgbModal);
  #profileService = inject (UserService);

  @Input () userResponse!: UserResponse;

  profile! : User;
  editAvatar : boolean = false;
  imageName='';
  coordinates : Coordinates = {
    latitude: 38.3245,
    longitude: -0.5
  }

  ngOnInit(): void {
    this.#titleService.setTitle("Profile");
    this.profile = this.userResponse.user;
    this.imageName = this.profile.avatar;
    this.coordinates.latitude = this.profile.lat;
    this.coordinates.longitude = this.profile.lng;
  }

  enableEditAvatar () {
    alert("enable");
    this.editAvatar = true;
  }

  async editProfile () {
    const modalRef = this.#modalService.open(EditProfileModalComponent);
    modalRef.componentInstance.profile = this.profile;
    return modalRef.result.catch(() => false);
  }

  async editPassword () {
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
      const newAvatar : UserAvatarEdit = {
        avatar : this.imageName
      }
      this.#profileService.saveAvatar(newAvatar).subscribe ({
        next: (r)=> {console.log (r)},
      })
    });
  }



  callToShowPosts() {
    //this.#router.navigate([`/posts/${this.item.id}/edit`]),
alert("call");
  }

}
