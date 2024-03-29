import { Component, Input } from '@angular/core';
import { CommentPost } from '../../interfaces/comment';
import { DatePipePipe } from '../pipes/date-pipe.pipe';

@Component({
  selector: 'comment-card',
  standalone: true,
  imports: [DatePipePipe],
  templateUrl: './comment-card.component.html',
  styleUrl: './comment-card.component.css'
})
export class CommentCardComponent {
  @Input() item!: CommentPost;
}
