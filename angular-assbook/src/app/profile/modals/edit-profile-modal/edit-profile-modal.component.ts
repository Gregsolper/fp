import { UserProfileEdit } from './../../../interfaces/user';
import { Component, Input, OnInit, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../interfaces/user';
import {
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TrueFalseModalComponent } from '../../../modals/true-false-modal/true-false-modal.component';
import { UserService } from '../../../services/user.service';
import { InfoModalComponent } from '../../../modals/info-modal/info-modal.component';

@Component({
  selector: 'edit-profile-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-profile-modal.component.html',
  styleUrl: './edit-profile-modal.component.css',
})
export class EditProfileModalComponent implements OnInit {
  @Input() profile!: User;
  #fb = inject(NonNullableFormBuilder);
  #modalService = inject(NgbModal);
  #profileService = inject(UserService);
  saved = false;

  editProForm = this.#fb.group({
    email: ['', [Validators.required, Validators.email]],
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  activeModal = inject(NgbActiveModal);

  ngOnInit(): void {
    this.editProForm.get('email')?.setValue(this.profile.email);
    this.editProForm.get('name')?.setValue(this.profile.name);
  }

  modifyProfile() {
    if (this.editProForm.pristine) {
      this.activeModal.close(false);
    } else {
      if (this.editProForm.invalid) {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.title = 'Review information';
        modalRef.componentInstance.body = 'Information not changed';
        modalRef.result.catch(() => false);
      } else {
        this.trySaveProfile();
      }
    }
  }

  trySaveProfile() {
    const userData: UserProfileEdit = {
      name: this.editProForm.controls.name.value,
      email: this.editProForm.controls.email.value,
    };
    this.#profileService.saveProfile(userData).subscribe({
      next: () => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.title = 'Profile';
        modalRef.componentInstance.body = 'updated';
        modalRef.result.catch(() => false);
        this.saved = true;
        this.activeModal.close(true);
      },
      error: (error) => {
        const modalRef = this.#modalService.open(InfoModalComponent);
        modalRef.componentInstance.title = 'Profile not updated';
        modalRef.componentInstance.body = error.messge;
        modalRef.result.catch(() => false);
        this.editProForm.reset();
      },
    });
  }

  exitEdit() {
    if (this.editProForm.pristine || this.saved) {
      this.activeModal.close(false);
    } else {
      const modalRef = this.#modalService.open(TrueFalseModalComponent);
      modalRef.componentInstance.title = 'Change not saved';
      modalRef.componentInstance.body = 'Do you want to leave?';
      modalRef.result
        .then((option) => {
          if (option === true) {
            this.activeModal.close(false);
          }
        })
        .catch(() => false);
    }
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
}
