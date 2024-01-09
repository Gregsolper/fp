import { Routes } from "@angular/router";
import { leavePageGuardGuard } from "../guards/leave-page-guard.guard";
import { logoutActivateGuard } from "../guards/logout-activate.guard";
/**
 * Routes for auth module
 * are lazy and use canActivate and canDeactivate Guards
 *
 * @see guards/logout-activate-guard
 * @see guards/leave-page-guard
 *
 */
export const authRoutes: Routes =[
  { path: 'login',
  canActivate: [logoutActivateGuard],
  loadComponent: ()=> import ('./login/login.component').then ((m)=>m.LoginComponent) },
  { path: 'register',
  canActivate: [logoutActivateGuard],
  canDeactivate: [leavePageGuardGuard] ,
  loadComponent: ()=> import ('./register/register.component').then ((m)=>m.RegisterComponent) },
];
