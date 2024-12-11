import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject, takeUntil } from 'rxjs';
import { RolesService } from '../../../modules.service';
import { BaseItem, SubItem } from '../../../modules.types';
import { RolesDetailsComponent } from '../../details.component';
import { CommonModule } from '@angular/common';
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector       : 'permission-drawer',
    templateUrl    : './drawer.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
      MatCheckboxModule,
      MatTooltipModule
    ],
})
export class PermissionDrawerComponent implements OnInit, OnDestroy
{

  selectedSubmodule:SubItem;
  permissionsForm: FormGroup;
  role$: Observable<BaseItem>;
  role: BaseItem;
  selectedPermissions = [];
  modulePermissions = [];

    /**
     * Constructor
     */
     private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
      private _detailsComponent: RolesDetailsComponent,
      private _itemService: RolesService,
      private _changeDetectorRef: ChangeDetectorRef,
      private _formBuilder: FormBuilder,
      private toastr: ToastrService,

      )
    {

    }
    ngOnInit(): void
    {
      this.role$ = this._itemService.item$;

      this._itemService.item$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((role: BaseItem) => {
            this.role = role;
            this._changeDetectorRef.markForCheck();
        });

      this._itemService.submodule$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((submodule: SubItem) => {

                this.selectedSubmodule = submodule;
                this.selectedPermissions = [];
                this.modulePermissions = [];

                if(this.selectedSubmodule) {
                  this.selectedSubmodule.permissions.forEach((permission) => {
                    if(this.role.permissions.indexOf(permission.permId) > -1) {
                      this.selectedPermissions.push(permission.permId);
                    }

                    this.modulePermissions.push(permission.permId);

                  })
                }

                this._changeDetectorRef.markForCheck();

            });

    }
    showOptions($event: MatCheckboxChange,  permId: number): void {
      const index = this.selectedPermissions.indexOf(permId)
      if(index > -1) {
        this.selectedPermissions.splice(index, 1)
      } else {
        this.selectedPermissions.push(permId);
      }

      this._changeDetectorRef.markForCheck();
  }

    chekforchecked(id: number): boolean {
      if(this.selectedPermissions.indexOf(id) > -1) {
        return true;
      } else {
        return false;
      }
    }

    closeDrawer(): void {
      this._detailsComponent.matDrawer.close()
    }



    updateSelectedItem(): void
    {
      this.modulePermissions.forEach(element => {
        if(this.role.permissions.indexOf(element) > -1) {
          this.role.permissions.splice(this.role.permissions.indexOf(element), 1);
        }
      });

      this.selectedPermissions.forEach(element => {
          this.role.permissions.push(element);
      });

        this._itemService.updateItemWithPerm(this.role.id, this.role).subscribe(
        (response) => {

            this.closeDrawer();
            this.toastr.success('Kayıt  Güncellendi', 'Başarılı', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-center'
              });

        },
        (response) => {

            this.toastr.error(response.error, 'Hata', {
                closeButton: true,
                progressBar: true,
                positionClass: 'toast-top-center'
              });
        });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
