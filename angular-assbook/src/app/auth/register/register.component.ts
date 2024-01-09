import { InfoModalComponent } from './../../modals/info-modal/info-modal.component';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { User } from '../../interfaces/user';
import { CanComponentDeactivate } from '../../interfaces/can-component-deactivate';
import { Router } from '@angular/router';
import { MyGeolocationService } from '../../services/my-geolocation.service';

import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrueFalseModalComponent } from '../../modals/true-false-modal/true-false-modal.component';

@Component({
  selector: 'register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit, CanComponentDeactivate {
  #formBuilder = inject(NonNullableFormBuilder);
  #userService = inject(UserService);
  #router = inject(Router);
  #modalService = inject(NgbModal);

  // Flag is used to allow leave the page
  saved: boolean = false;
  // To save the imageName with format
  imageName = '';
  /**
   * Form definition and Validators
   */
  userForm = this.#formBuilder.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.email, Validators.required]],
      email2: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      lng: [0],
      lat: [0],

      avatar: ['', [Validators.required]],
    },
    { validators: this.noMatch }
  );
  /**
   * Set user location
   */
  async ngOnInit(): Promise<void> {
    const location = await MyGeolocationService.getLocation();
    this.userForm.get('lat')?.setValue(location.latitude);
    this.userForm.get('lng')?.setValue(location.longitude);
  }
  /**
   * Validate if email and email2 match
   * @param control Form control
   * @returns true if not valid, null if valid
   */
  noMatch(control: AbstractControl): ValidationErrors | null {
    const email = control.get('email')?.value;
    const email2 = control.get('email2')?.value;
    return email === email2 ? null : { misMatch: true };
  }
  /**
   * Check if it is possible to leave without loose of information
   * @returns true if can exit or false if not.
   */
  canDeactivate() {
    // if the form has not been modified
    if (this.userForm.pristine || this.saved) {
      return true;
    }
    const modalRef = this.#modalService.open(TrueFalseModalComponent);
    modalRef.componentInstance.title = 'Change not saved';
    modalRef.componentInstance.body = 'Do you want to leave the page?';
    return modalRef.result.catch(() => false);
  }
  /**
   * funciton to call Modal Info
   * @param title is show in the head
   * @param body  the information
   * @returns  return true or false according with user's wishes
   */
  async callInfoModal(title: string, body: string) {
    const modalRef = this.#modalService.open(InfoModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    return modalRef.result.catch(() => false);
  }
  /**
   * Is trigerd by change in forma's image input
   * @param event contains event information as file
   * @returns none
   */
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
  /**
   *
   * @param formControl control for field
   * @param validClass when control is touches and is valid
   * @param errorClass when control is touches and is invalid
   * @returns set of classes
   */
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
  /**
   * Prepare information to be save and send it to Server
   * inform retult to User
   */
  registerUser() {
    if (this.userForm.valid) {
      const newUser: User = {
        name: this.userForm.controls.name.value,
        email: this.userForm.controls.email.value,
        password: this.userForm.controls.password.value,
        lat: this.userForm.controls.lat.value,
        lng: this.userForm.controls.lng.value,
        avatar: this.imageName,
      };

      this.#userService.registerUser(newUser).subscribe({
        next: async (user) => {
          this.saved = true;
          console.log('added:' + user);
          await this.callInfoModal('User added', 'login please');
          this.#router.navigate(['/posts']);
        },
        error: (error) => {
          console.error('No added **' + error.message);
          const mensaje = error.message as string;
          this.callInfoModal('User not added', mensaje);
          this.imageName = '';
        },
        complete: () => this.#router.navigate(['/posts']),
      });
    }
  }
  /**
   * Return to login page
   */
  goBack() {
    this.#router.navigate(['/auth/login']);
    console.log(this.userForm.getError('name'));
  }
}
