import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { SettingsSablonComponent } from './modules.component';
import { ModulesService } from './modules.service';
import { BaseModulesListComponent } from './list/module.component';
import { ProjectDetailsComponent } from './details/details.component';

const basemoduleResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const academyService = inject(ModulesService);
  academyService.getSelects().subscribe();
  academyService.setPathType(route.params.type);
  return academyService.getitems();
};

const projectDetailsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const projectService = inject(ModulesService);
  return projectService.getItemDetailsById(route.params.id);
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
      {
        path: 'details/:id',
        component: ProjectDetailsComponent,
        resolve: {
          item: projectDetailsResolver,
        },
      },
    ],
  },
] as Routes;
