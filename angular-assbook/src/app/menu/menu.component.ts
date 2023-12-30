import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  Router,
} from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { InfoModalComponent } from '../modals/info-modal/info-modal.component';

@Component({
  selector: 'menu',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  title = 'Angular-Assbook';
  #authService = inject(AuthService);
  #modalService = inject(NgbModal);
  #router = inject(Router);

  logged = computed(() => this.#authService.logged());
  mostrar = localStorage.getItem('token');

  async logout() {
    await this.callInfoModal("Assbook posts","return soon..");
    this.#authService.logout();
    this.#router.navigate(['/login']);
  }

  callInfoModal(title: string, body: string) {
    const modalRef = this.#modalService.open(InfoModalComponent);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.body = body;
    return modalRef.result.catch(() => false);
  }
}
