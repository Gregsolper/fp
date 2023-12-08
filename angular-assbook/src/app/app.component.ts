import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { RouterOutlet,RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink,RouterLinkActive, PostsPageComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular-Assbook';
}
