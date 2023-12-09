import { Routes } from "@angular/router";
import { leavePageGuardGuard } from "../guards/leave-page-guard.guard";
import { numericIdGuardGuard } from "../guards/numeric-id-guard.guard";
import { postResolver } from "./resolvers/post.resolver";

export const postsRoutes: Routes =[
  { path: '',
        loadComponent:()=>
            import('./posts-page/posts-page.component').then((m)=>m.PostsPageComponent )
          },
  { path: 'add',
        canDeactivate: [leavePageGuardGuard] ,
        loadComponent:()=>
            import('./post-form/post-form.component').then ((m)=>m.PostFormComponent)
           },
    // You can see in this line that a Guard prevents no numeric activation
  { path: ':id',
        canActivate: [numericIdGuardGuard],
        resolve: {post:postResolver},
        loadComponent: ()=> import('./post-detail/post-detail.component').then((m)=>m.PostDetailComponent)
         },
];
