import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { FormGroup, ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSelectModule } from '@angular/material/select'
import { FuseVerticalNavigationComponent } from '@fuse/components/navigation'
import { FuseNavigationItem } from '@fuse/components/navigation/navigation.types'
import { RolesService } from '../../modules.service'
import { RolesListComponent } from '../module.component'
import { CommonModule } from '@angular/common'
import { Subject, takeUntil } from 'rxjs'
import { moduleConfig } from '../../module.config'

@Component({
  selector: moduleConfig.type + '-' + moduleConfig.type2 + '-sidebar',
  template: `
    <div>
      <button mat-button [color]="'warn'" (click)="closeDrawer()" class=" absolute right-2 text-warn-500 min-w-0 mt-4" style="z-index: 9999;">
        X
      </button>
      <div class="flex flex-col w-full pt-12 p-6 -mb-4" *ngIf="this._component.selection.selected.length > 0">
        <div class="w-full"><b>{{this._component.selection.selected.length }}</b> kayıt seçildi - <a (click)="clearSelection()" class="cursor-pointer text-blue-600" >Temizle</a></div>
        <button class="w-full mt-4 bg-slate-600 text-white " *ngIf="this.moduleConfig.updateMulti"  (click)="this.openMultiEdit()" mat-flat-button>Seçilenleri Güncelle</button>
        <button class="w-full mt-2 bg-slate-600 text-white " *ngIf="this.moduleConfig.exportItems"  (click)="this.exportToExcell(true)" mat-flat-button>Seçilenleri Excel'e Aktar</button>

      </div>
      <div *ngIf="this._component.selection.selected.length > 0" class="dividermaindiv -mb-2">
              <div class="divider dividersubdiv"></div>
            </div>
      <fuse-vertical-navigation
        [appearance]="'default'"
        [navigation]="menuData"
        [inner]="true"
        [mode]="'side'"
        [name]="'demo-sidebar-navigation'"
        [opened]="true"
      >
      </fuse-vertical-navigation>

      <form class="flex flex-col w-full" [formGroup]="filterForm">
        <div class="flex flex-col sm:flex-row p-6 pt-0">
          <div class="flex flex-auto flex-wrap">
            <!--
            <mat-form-field class="w-full">
              <mat-label>Durum</mat-label>
              <mat-select [formControlName]="'status'" [placeholder]="'Lütfen Seçiniz'">
                <ng-container>
                  <mat-option [value]="'1'"> Aktif </mat-option>
                  <mat-option [value]="'2'"> Pasif </mat-option>
                </ng-container>
              </mat-select>
            </mat-form-field>
            <button class="w-full" (click)="this.setFilter()" mat-flat-button [color]="'primary'">ARA</button>
            <button class="w-full mt-2" (click)="this.clearFilter()" mat-button [color]="'warn'">TEMİZLE</button>
            <div class="dividermaindiv">
              <div class="divider dividersubdiv"></div>
            </div>
-->

            <button class="w-full mt-2"  *ngIf="this.moduleConfig.exportItems"  mat-flat-button [color]="'accent'">
              <mat-icon [svgIcon]="'heroicons_outline:document-arrow-down'"></mat-icon>
              <span (click)="this.exportToExcell(false)" class="ml-2 mr-1 hidden md:block">Excel'e Aktar</span>
            </button>
            <!--
            <button class="w-full mt-2" mat-flat-button [color]="'accent'">
              <mat-icon [svgIcon]="'heroicons_outline:document-arrow-up'"></mat-icon>
              <span class="ml-2 mr-1 hidden md:block">Excel ile Yükle</span>
            </button>
            -->
          </div>
        </div>
      </form>
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
export class SidebarComponent implements OnInit, OnDestroy {
  moduleConfig = moduleConfig
  menuData: FuseNavigationItem[]
  filterForm: FormGroup;
  filter: any;
  counts = {
    count1: 0,
    count2: 0,
  }
  private _unsubscribeAll: Subject<any> = new Subject<any>()

  /**
   * Constructor
   */
  constructor(private _itemService: RolesService,     private _formBuilder: UntypedFormBuilder, public _component: RolesListComponent) {

   
  }

  createFilterForm(): void {
    this.filterForm = this._formBuilder.group({
      status: [this.filter?.status],
    })
  }

  closeDrawer(): void {
    this._itemService._drawer.next(true)
  }

  clearFilter(): void {
    this.filterForm.reset();
    this._itemService.setFiter('');
  }

  clearSelection(): void {
    this._component.selection.clear()
  }

  setFilter(): void {
    this._itemService.setFiter(JSON.stringify(this.filterForm.value)) 
  }

  exportToExcell(justSelected: boolean): void {
    this._component.exportData(justSelected)
  }

  openMultiEdit(): void {
    this._component.openMultiEditDialog()
  }


  ngOnInit(): void {
    if (this._itemService.filter && this._itemService.filter !== '') {
      this.filter = JSON.parse(this._itemService.filter);
    }
    this._itemService._counts.pipe(takeUntil(this._unsubscribeAll)).subscribe((counts) => {
      this.counts = counts
      this.menuData = [
        {
          title: 'Durum',
          type: 'group',
          children: [
            {
              title: 'Tümü',
              type: 'basic',
              icon: 'mat_solid:all_inclusive',
              link : '/administration/roles/0',
              badge: {
                title: (this.counts.count1 + this.counts.count2).toString(),
                classes: 'bg-blue-500 text-white px-2 rounded-full',
              }
            },
            {
              title: 'Aktif',
              type: 'basic',
              icon: 'heroicons_solid:check',
              link : '/administration/roles/1',
              badge: {
                title: this.counts.count1.toString(),
                classes: 'bg-green-700 text-white px-2 rounded-full',

              }
            },
            {
              title: 'Pasif',
              type: 'basic',
              icon: 'heroicons_solid:x-mark',
              link : '/administration/roles/2',
              badge: {
                title: this.counts.count2.toString(),
                classes: 'bg-red-700 text-white px-2 rounded-full',

              }
            },
          ],
        },
  
        {
          type: 'divider',
        },

        
      ];
    })
    this.createFilterForm();
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null)
    this._unsubscribeAll.complete()
  }

}
