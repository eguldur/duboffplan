import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { RolesService } from '../../../modules.service';
import { moduleConfig } from '../../../module.config';

@Component({
    selector       : moduleConfig.type + '-' + moduleConfig.type2 + '-multiedit-dialog',
    templateUrl    : './dialog.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports     : [
      CommonModule,
      MatButtonModule,
      MatFormFieldModule,
      MatInputModule,
      ReactiveFormsModule,
      MatSelectModule,
      FormsModule,
      MatSlideToggleModule,
      MatDividerModule,
      MatIconModule,
      MatMenuModule,
      MatDialogModule
  ],
})
export class MultiEditDialogComponent implements OnInit, OnDestroy
{
    composeForm: FormGroup;
    dialogTitle:string = ''
    itemForm: FormGroup;
    selectedIds: string[] = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _itemService: RolesService,
        private dialogRef: MatDialogRef<MultiEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    )
    {
        this.dialogTitle = data.dialogTitle;
        this.selectedIds = data.selectedIds;
      }
    

    ngOnInit(): void
    {
      this.itemForm = this._formBuilder.group({
          isActive: [false],
          updateIds: [this.selectedIds]
      });
    }

    updateItems(): void
    {
        const item = this.itemForm.getRawValue();
        this._itemService.updateitemMulti(item).subscribe((res) => {
            this._itemService.getitems().subscribe();
        }, (err) => {
        }
        );
        this.dialogRef.close('success');
        this._changeDetectorRef.markForCheck();
    }
    
    ngOnDestroy(): void
    {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
    
}
