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
      {
        path: 'settings',
        children: [
          {path: 'phonetypes', loadChildren: () => import('app/modules/admin/settings/phonetypes/modules.routes')},
          {path: 'socialmediaplatforms', loadChildren: () => import('app/modules/admin/settings/socialmediaplatforms/modules.routes')},
          {path: 'buildingtypes', loadChildren: () => import('app/modules/admin/settings/buildingtypes/modules.routes')},
          {path: 'propertytypes', loadChildren: () => import('app/modules/admin/settings/propertytypes/modules.routes')},
          {path: 'unvans', loadChildren: () => import('app/modules/admin/settings/unvans/modules.routes')},
          {path: 'usagetypes', loadChildren: () => import('app/modules/admin/settings/usagetypes/modules.routes')},
        ]
      },
      {
        path: 'developers',
        children: [
          {path: 'developer', loadChildren: () => import('app/modules/admin/developers/developer/modules.routes')},
        ]
      },
      {
        path: 'projects',
        children: [
          {path: 'project', loadChildren: () => import('app/modules/admin/projects/project/modules.routes')},
        ]
      },
      {
        path: 'mcompanies',
        children: [
          {path: 'mcompany', loadChildren: () => import('app/modules/admin/mcompanies/mcompany/modules.routes')},
        ]
      },
      {
        path: 'contacts',
        children: [
          {path: 'contact', loadChildren: () => import('app/modules/admin/contacts/contact/modules.routes')},
        ]
      }
    ],
  },
];
