import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../../../interfaces/user';
import { InfoModalComponent } from '../../../modals/info-modal/info-modal.component';
import { TrueFalseModalComponent } from '../../../modals/true-false-modal/true-false-modal.component';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'edit-pass-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-pass-modal.component.html',
  styleUrl: './edit-pass-modal.component.css',
})
export class EditPassModalComponent {
  @Input() profile!: User;
  #fb = inject(NonNullableFormBuilder);
  #modalService = inject(NgbModal);
  #profileService = inject(UserService);
  saved = false;

  editPassForm = this.#fb.group(
    {
      password1: ['', [Validators.required, Validators.minLength(4)]],
      password2: ['', [Validators.required, Validators.minLength(4)]],
    },
    { validators: this.noMatch }
  );

  activeModal = inject(NgbActiveModal);

  noMatch(control: AbstractControl): ValidationErrors | null {
    const pass1 = control.get('password1')?.value;
    const pass2 = control.get('password2')?.value;
    return pass1 === pass2 ? null : { misMatch: true };
  }
  modifyProfile() {
    if (this.editPassForm.pristine) {
      this.activeModal.close(false);
    } else {
      if (this.editPassForm.invalid) {
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
    this.#profileService
      .savePassword(this.editPassForm.controls.password1.value)
      .subscribe({
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
          this.editPassForm.reset();
        },
      });
  }

  exitEdit() {
    if (this.editPassForm.pristine || this.saved) {
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
