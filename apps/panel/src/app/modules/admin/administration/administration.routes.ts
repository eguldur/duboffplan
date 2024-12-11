import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { ModulesComponent } from './basemodules/modules.component';
import { ModulesService } from './basemodules/modules.service';
import { BaseModulesListComponent } from './basemodules/list/module.component';
import { SubModulesComponent } from './submodules/modules.component';
import { SubModulesListComponent } from './submodules/list/module.component';
import { SubModulesService } from './submodules/modules.service';
import { PermissionsComponent } from './permissions/modules.component';
import { PermissionsListComponent } from './permissions/list/module.component';
import { PermissionsService } from './permissions/modules.service';
import { RolesListComponent } from './roles/list/module.component';
import { RolesComponent } from './roles/modules.component';
import { RolesService } from './roles/modules.service';
import { RolesDetailsComponent } from './roles/details/details.component';
import { UsersComponent } from './users/modules.component';
import { UsersListComponent } from './users/list/module.component';
import { UsersService } from './users/modules.service';

const basemoduleResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const academyService = inject(ModulesService);
    academyService.setPathType(route.params.type);
    return academyService.getitems();
}

const submoduleResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const academyService = inject(SubModulesService);
    academyService.setPathType(route.params.type);
    academyService.getSelects().subscribe();
    return academyService.getitems();
}




const permissionsResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const academyService = inject(PermissionsService);
    academyService.setPathType(route.params.type);
    academyService.getSelects().subscribe();
    return academyService.getitems();
}

const rolesResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const academyService = inject(RolesService);
    academyService.setPathType(route.params.type);

    return academyService.getitems();
}

const rolesDetailResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const academyService = inject(RolesService);
    academyService.getItemDetailsById(route.params.id).subscribe();
    return academyService.getSubModules();
}


const usersResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
{
    const academyService = inject(UsersService);
    academyService.setPathType(route.params.type);
    academyService.getSelects().subscribe();
    return academyService.getitems();
}
export default [
    {
        path      : 'basemodules',
        pathMatch : 'full',
        redirectTo: 'basemodules/0',
    },
    {
        path     : 'basemodules',
        component: ModulesComponent,
        children : [
            {
                path     : ':type',
                component: BaseModulesListComponent,
                resolve  : {
                    items  : basemoduleResolver,
                },
            },
        ],
    },
    {
        path      : 'submodules',
        pathMatch : 'full',
        redirectTo: 'submodules/0',
    },
    {
        path     : 'submodules',
        component: SubModulesComponent,
        children : [
            {
                path     : ':type',
                component: SubModulesListComponent,
                resolve  : {
                    items  : submoduleResolver,
                },
            },
        ],
    },
    {
        path      : 'permissions',
        pathMatch : 'full',
        redirectTo: 'permissions/0',
    },
    {
        path     : 'permissions',
        component: PermissionsComponent,
        children : [
            {
                path     : ':type',
                component: PermissionsListComponent,
                resolve  : {
                    items  : permissionsResolver,
                },
            },
        ],
    },
    {
        path      : 'roles',
        pathMatch : 'full',
        redirectTo: 'roles/0',
    },
    {
        path     : 'roles',
        component: RolesComponent,
        children : [
            {
                path     : ':type',
                component: RolesListComponent,
                resolve  : {
                    items  : rolesResolver,
                },
            },
            {
                path     : 'detail/:id',
                component: RolesDetailsComponent,
                resolve  : {
                    items  : rolesDetailResolver,
                },
                
            },
        ],
    },
    {
        path      : 'users',
        pathMatch : 'full',
        redirectTo: 'users/0',
    },
    {
        path     : 'users',
        component: UsersComponent,
        children : [
            {
                path     : ':type',
                component: UsersListComponent,
                resolve  : {
                    items  : usersResolver,
                },
            },
        ],
    },
    {path: 'icons', loadChildren: () => import('./icons/icons.routes')},


    
] as Routes;
