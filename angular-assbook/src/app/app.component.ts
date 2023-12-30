import { MenuComponent } from './menu/menu.component';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsPageComponent } from './posts/posts-page/posts-page.component';

import { RouterOutlet,RouterLink, RouterLinkActive } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,
    MenuComponent,
    RouterOutlet,
    RouterLink, //
    RouterLinkActive, //
    PostsPageComponent,
    ReactiveFormsModule   //
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}
