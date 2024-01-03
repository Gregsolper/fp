import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'auth', loadChildren: ()=> import ('./auth/auth.routes').then ((m)=>m.authRoutes) },
  { path: 'posts',  loadChildren: ()=> import('./posts/posts.routes').then ((m)=>m.postsRoutes) },
  { path: 'profile',  loadChildren: ()=> import('./profile/profile.routes').then ((m)=>m.profileRoutes) },
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/auth/login' },
];
