import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'login', loadChildren: ()=> import ('./auth/auth.routes').then ((m)=>m.authRoutes) },
  { path: 'posts',  loadChildren: ()=> import('./posts/posts.routes').then ((m)=>m.postsRoutes) },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
