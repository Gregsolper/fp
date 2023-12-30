import { Component, Input, inject } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'true-false-modal',
  standalone: true,
  imports: [],
  templateUrl: './true-false-modal.component.html',
  styleUrl: './true-false-modal.component.css'
})
export class TrueFalseModalComponent {
  @Input() title!: string;
  @Input() body!: string;

  activeModal = inject(NgbActiveModal);
}
