import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';


export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: 'example' },

  
  { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'example' },

  {
    path: '',
    canActivate: [NoAuthGuard],
    canActivateChild: [NoAuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'confirmation-required',
        loadChildren: () =>
          import(
            'app/modules/auth/confirmation-required/confirmation-required.routes'
          ),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('app/modules/auth/forgot-password/forgot-password.routes'),
      },
      {
        path: 'reset-password',
        loadChildren: () =>
          import('app/modules/auth/reset-password/reset-password.routes'),
      },
      {
        path: 'sign-in',
        loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes'),
      },
      {
        path: 'sign-up',
        loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes'),
      },
      {
        path: 'confirm-email',
        loadChildren: () =>
          import('app/modules/auth/confirm-email/confirm-email.routes'),
      },
    ],
  },

  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'sign-out',
        loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes'),
      },
      {
        path: 'unlock-session',
        loadChildren: () =>
          import('app/modules/auth/unlock-session/unlock-session.routes'),
      },
    ],
  },

  {
    path: '',
    component: LayoutComponent,
    data: {
      layout: 'empty',
    },
    children: [
      {
        path: 'home',
        loadChildren: () => import('app/modules/landing/home/home.routes'),
      },
    ],
  },

  {
    path: '',
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: LayoutComponent,
    resolve: {
      initialData: initialDataResolver,
    },
    children: [
      {
        path: 'example',
        loadChildren: () => import('app/modules/admin/example/example.routes'),
      },
      {path: 'me', children: [
        {path: 'profile', loadChildren: () => import('app/modules/admin/me/profile/profile.routes')},

        // Settings
        {path: 'settings', loadChildren: () => import('app/modules/admin/me/settings/settings.routes')},
      ]},
      {
        path: 'administration',
        loadChildren: () =>
          import('app/modules/admin/administration/administration.routes'),
      },
    ],
  },
];
