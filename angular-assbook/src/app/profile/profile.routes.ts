import { Routes } from '@angular/router';
import { loginActivateGuard } from '../guards/login-activate.guard';
import { profileResolver } from './resolvers/profile.resolver';

export const profileRoutes: Routes =[
  { path: '',
  resolve: {userResponse: profileResolver},
  canActivate: [loginActivateGuard],
  loadComponent: ()=> import ('./profile-page/profile-page.component').then ((m)=>m.ProfilePageComponent) },
  { path: ':id',
  resolve: {userResponse: profileResolver},
  canActivate: [loginActivateGuard],
  //canDeactivate: [leavePageGuardGuard] ,
  loadComponent: ()=> import ('./profile-page/profile-page.component').then ((m)=>m.ProfilePageComponent) },
];
