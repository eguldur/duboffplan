import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { debounceTime, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { RolesService } from '../modules.service';
import { BaseItem, SubItem } from '../modules.types';
import { fuseAnimations } from '@fuse/animations';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { PermissionDrawerComponent } from './rightsidebar/permisssionDrawer/drawer.component';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector       : 'roles-details',
    templateUrl    : './details.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone: true,
    imports: [
      CommonModule,
      MatProgressBarModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      FormsModule,
      MatIconModule,
      MatDialogModule,
      MatButtonModule,
      MatSortModule,
      MatPaginatorModule,
      MatSlideToggleModule,
      MatSelectModule,
      MatOptionModule,
      MatCheckboxModule,
      MatRippleModule,
      MatSidenavModule,
      PermissionDrawerComponent,
      RouterLink,
      CdkScrollable,
      
    ],
})
export class RolesDetailsComponent implements OnInit, OnDestroy
{
  @ViewChild('matDrawer', {static: true}) matDrawer: MatDrawer;
  drawerMode: 'side' | 'over';
  searchInputControl: FormControl = new FormControl();
  role$: Observable<BaseItem>;
  role: BaseItem;

  permissionsCount = 0;
  submodules$: Observable<SubItem[]>;
  selectedSubmodule: SubItem;

    /**
     * Constructor
     */

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
      private _activatedRoute: ActivatedRoute,
      private _router: Router,
      private _changeDetectorRef: ChangeDetectorRef,
      private _itemService: RolesService,
      private _fuseMediaWatcherService: FuseMediaWatcherService

    )
    {
    }
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    ngOnInit(): void
    {
      this.role$ = this._itemService.item$;
      this.submodules$ = this._itemService.submodules$;

      this._itemService.item$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((role: BaseItem) => {

          this.role = role;
      });
      this._itemService.submodule$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((submodule: SubItem) => {

                this.selectedSubmodule = submodule;
                this.matDrawer.open();
                this._changeDetectorRef.markForCheck();
            });

      this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Set the drawerMode if the given breakpoint is active
                if ( matchingAliases.includes('lg') )
                {
                    this.drawerMode = 'side';
                }
                else
                {
                    this.drawerMode = 'over';
                }

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

      this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                switchMap(query =>
                    this._itemService.getSubModules(query)
                )
            )
            .subscribe();
    }
    onSubmoduleClicked(subModule: SubItem): void
    {
        this._itemService.getSubModule(subModule);

    }
    onBackdropClicked(): void
    {


    }

    countIzin(submodule): number
    {
      let a = 0;


      submodule.permissions.forEach((permission) => {
        if(this.role.permissions.indexOf(permission.permId) > -1) {
          a++;
        }
      });
      return a;

    }
}
