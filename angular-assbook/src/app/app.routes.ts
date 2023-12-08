import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PostsPageComponent } from './posts-page/posts-page.component';
import { PostFormComponent } from './post-form/post-form.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { numericIdGuardGuard } from './guards/numeric-id-guard.guard';
import { leavePageGuardGuard } from './guards/leave-page-guard.guard';
import { postResolver } from './resolvers/post.resolver';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'posts', component: PostsPageComponent },
  { path: 'posts/add', canDeactivate: [leavePageGuardGuard] ,component: PostFormComponent },
    // You can see in this line that a Guard prevents no numeric activation
  { path: 'posts/:id', canActivate: [numericIdGuardGuard], resolve: {post:postResolver},  component: PostDetailComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
