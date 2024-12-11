import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormGroup,
  ReactiveFormsModule,
  UntypedFormBuilder,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types';

import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { moduleConfig } from './module.config';

@Component({
  selector: moduleConfig.type + '-' + moduleConfig.type2 + '-sidebar',
  template: `
    <div>
      <fuse-vertical-navigation
        [appearance]="'default'"
        [navigation]="menuData"
        [inner]="true"
        [mode]="'side'"
        [name]="'demo-sidebar-navigation'"
        [opened]="true"
      >
      </fuse-vertical-navigation>
    </div>
  `,
  styles: [
    `
      demo-sidebar fuse-vertical-navigation .fuse-vertical-navigation-wrapper {
        box-shadow: none !important;
      }
      .dividermaindiv {
        margin: 24px -24px;
        display: flex;
        flex-direction: column;
        flex: 1 0 auto;
        -webkit-user-select: none;
        user-select: none;
        width: 100%;
      }
      .dividersubdiv {
        height: 1px;
        box-shadow: 0 1px 0 0;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [
    CommonModule,
    FuseVerticalNavigationComponent,
    MatIconModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class IconsSidebarComponent implements OnInit {
  moduleConfig = moduleConfig;
  menuData: FuseNavigationItem[];
  filterForm: FormGroup;
  filter: any;
  counts = {
    count1: 0,
    count2: 0,
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  /**
   * Constructor
   */
  constructor() {}

  ngOnInit(): void {
    this.menuData = [
      {
        title: 'Menü',
        type: 'group',
        children: [
          {
            title: 'Heroicons Outline',
            type: 'basic',
            icon: 'mat_solid:all_inclusive',
            link: '/administration/icons/heroicons-outline',
          },
          {
            title: 'Heroicons Solid',
            type: 'basic',
            icon: 'mat_solid:all_inclusive',
            link: '/administration/icons/heroicons-solid',
          },
          {
            title: 'Heroicons Mini',
            type: 'basic',
            icon: 'mat_solid:all_inclusive',
            link: '/administration/icons/heroicons-mini',
          },
          {
            title: 'Material Solid',
            type: 'basic',
            icon: 'mat_solid:all_inclusive',
            link: '/administration/icons/material-solid',
          },
          {
            title: 'Material Outline',
            type: 'basic',
            icon: 'mat_solid:all_inclusive',
            link: '/administration/icons/material-outline',
          },
          {
            title: 'Material Twotone',
            type: 'basic',
            icon: 'mat_solid:all_inclusive',
            link: '/administration/icons/material-twotone',
          },
          {
            title: 'Feather',
            type: 'basic',
            icon: 'mat_solid:all_inclusive',
            link: '/administration/icons/feather',
          },
        ],
      },

      {
        type: 'divider',
      },
    ];
  }
}
