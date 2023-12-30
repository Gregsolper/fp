import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'info-modal',
  standalone: true,
  imports: [],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.css',
})
export class InfoModalComponent {
  @Input() title!: string;
  @Input() body!: string;

  activeModal = inject(NgbActiveModal);
}
