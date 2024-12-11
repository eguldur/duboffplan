import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, InjectionToken, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ModulesService } from '../../../modules.service';
import { moduleConfig } from '../../../module.config';

@Component({
    selector       : moduleConfig.type + '-' + moduleConfig.type2 + '-multiadd-dialog',
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
export class MultiAddDialogComponent implements OnInit, OnDestroy
{
    composeForm: FormGroup;
    dialogTitle:string = ''
    itemForm: FormGroup;
    settingType: string = '';

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _formBuilder: FormBuilder,
        private _itemService: ModulesService,
        private dialogRef: MatDialogRef<MultiAddDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    )
    {
        this.dialogTitle = data.dialogTitle;
        this.settingType = data.settingType;
      }
    

    ngOnInit(): void
    {
      this.itemForm = this._formBuilder.group({
          title: [null, [Validators.required]],  
          isActive: [false],
          type: [this.settingType]
      });
    }

    updateItems(): void
    {
        const updateItems = [];
        const item = this.itemForm.getRawValue();
        const arrayOfLines = item.title.split("\n");


        arrayOfLines.forEach(element => {
            const arrayOfItems = element.split(",");
            if(arrayOfItems.length > 0)
            {
                const newItem = {
                    title: arrayOfItems[0].trim(),
                    siraNo: arrayOfItems[1]?parseInt(arrayOfItems[1].trim()):999,
                    isActive: item.isActive,
                    type: this.settingType
                }
                updateItems.push(newItem);
            }
        }
        );
            

        
        this._itemService.createitemsMulti(updateItems).subscribe((res) => {
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
