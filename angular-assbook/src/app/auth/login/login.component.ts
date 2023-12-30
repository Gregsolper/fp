import { FormControl, FormsModule, Validators } from '@angular/forms';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { LoadGoogleApiService } from '../google-login/load-google-api.service';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { GoogleLoginDirective } from '../google-login/google-login.directive';
import { FbLoginDirective } from '../facebook-login/fb-login.directive';
import { MyGeolocationService } from '../../services/my-geolocation.service';
import { UserLogin } from '../../interfaces/user';
import { AuthService } from '../auth.service';
import { InfoModalComponent } from '../../modals/info-modal/info-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule, FormsModule, GoogleLoginDirective,FbLoginDirective],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{
  #loadGoogle = inject(LoadGoogleApiService);

  iconGoogle = faGoogle;
  credentialsSub!: Subscription;
  iconFacebook = faFacebook;
  #router = inject (Router);
  #authService = inject(AuthService);
  #titleService = inject (Title);
  #modalService = inject (NgbModal);
  #formBuilder = inject(NonNullableFormBuilder);


  loginForm = this.#formBuilder.group ({
    email: ['',[Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.#titleService.setTitle("Posts|Login ");
    this.credentialsSub = this.#loadGoogle.credential$.subscribe(
      resp => console.log(resp.credential) // Send this to your back-end
    );
  }

  async login () {

    const location = await MyGeolocationService.getLocation();
    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    const user: UserLogin = {
        email: email,
        password: password,
        lat: location.latitude,
        lng: location.longitude,
    };
    this.#authService
        .login(user).subscribe({
          next: async () => {

            await this.callInfoModal ("Wellcome","enjoy posts");
            this.#router.navigate(['/posts']);
          },
          error: async (error) =>{
            await this.callInfoModal ("Could not login", error.message);
          }
        });

  }

  goRegister (){
    this.#router.navigate(['/auth/register']);
  }
  ngOnDestroy(): void {
    this.credentialsSub.unsubscribe();
}

loggedFacebook(resp: fb.StatusResponse) {
  // Send this to your server
  console.log(resp.authResponse.accessToken);
}

showError(error: unknown) {
  console.error(error);
}

callInfoModal (title:string, body:string){
  const modalRef = this.#modalService.open(InfoModalComponent);
  modalRef.componentInstance.title = title;
  modalRef.componentInstance.body = body;
  return modalRef.result.catch(()=>false);
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
