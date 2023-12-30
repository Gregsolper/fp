import { Routes } from "@angular/router";
import { leavePageGuardGuard } from "../guards/leave-page-guard.guard";
export const authRoutes: Routes =[
  { path: 'login', loadComponent: ()=> import ('./login/login.component').then ((m)=>m.LoginComponent) },
  { path: 'register',
  canDeactivate: [leavePageGuardGuard] ,
  loadComponent: ()=> import ('./register/register.component').then ((m)=>m.RegisterComponent) },
];
