import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { AnalyticsComponent } from 'app/modules/admin/dashboards/analytics/analytics.component';
import { AnalyticsService } from 'app/modules/admin/dashboards/analytics/analytics.service';

const basemoduleResolver = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const analyticsService = inject(AnalyticsService);
    analyticsService.getDataReal().subscribe();
    return analyticsService.getData();
  };
  
export default [
    {
        path: '',
        component: AnalyticsComponent,
        resolve: {
            data: basemoduleResolver,
        },
    },
] as Routes;
