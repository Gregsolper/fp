import { Component, Input } from '@angular/core';
import { User } from '../../interfaces/user';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'profile-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile-detail.component.html',
  styleUrl: './profile-detail.component.css'
})
export class ProfileDetailComponent {
  @Input () user!: User;


}
