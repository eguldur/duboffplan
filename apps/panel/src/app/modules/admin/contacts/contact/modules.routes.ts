import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { SettingsSablonComponent } from './modules.component';
import { ModulesService } from './modules.service';
import { BaseModulesListComponent } from './list/module.component';

const basemoduleResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const academyService = inject(ModulesService);
  academyService.setPathType(route.params.type);
  academyService.getSelects().subscribe();
  return academyService.getitems();
};

export default [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '1',
  },
  {
    path: '',
    component: SettingsSablonComponent,
    children: [
      {
        path: ':type',
        component: BaseModulesListComponent,
        resolve: {
          items: basemoduleResolver,
        },
      },
    ],
  },
] as Routes;
