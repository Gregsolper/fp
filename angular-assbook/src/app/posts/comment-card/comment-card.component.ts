import { Component, Input } from '@angular/core';
import { CommentPost } from '../../interfaces/comment';

@Component({
  selector: 'comment-card',
  standalone: true,
  imports: [],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css'
})
export class CommentCardComponent {
  @Input() item!: CommentPost;
}
