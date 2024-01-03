import { Routes } from "@angular/router";
import { leavePageGuardGuard } from "../guards/leave-page-guard.guard";
import { logoutActivateGuard } from "../guards/logout-activate.guard";
export const authRoutes: Routes =[
  { path: 'login',
  canActivate: [logoutActivateGuard],
  loadComponent: ()=> import ('./login/login.component').then ((m)=>m.LoginComponent) },
  { path: 'register',
  canActivate: [logoutActivateGuard],
  canDeactivate: [leavePageGuardGuard] ,
  loadComponent: ()=> import ('./register/register.component').then ((m)=>m.RegisterComponent) },
];
