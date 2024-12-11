import { Routes } from '@angular/router';
import { CanfirmEmailComponent } from './confirm-email.component';

export default [
    {
        path     : ':token',
        component: CanfirmEmailComponent,
    },
] as Routes;
