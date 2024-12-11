import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatOptionModule, MatRippleModule } from '@angular/material/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'
import { MatProgressBarModule } from '@angular/material/progress-bar'
import { MatSelectModule } from '@angular/material/select'
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatSort, MatSortModule } from '@angular/material/sort'
import { fuseAnimations } from '@fuse/animations'
import { FuseConfirmationService } from '@fuse/services/confirmation'
import { ModulesService } from '../modules.service'
import { ItemPagination, BaseItem } from '../modules.types'
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs'
import { CdkScrollable } from '@angular/cdk/scrolling'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav'
import { SidebarComponent } from './leftsidebar/sidebar.component'
import { FuseMediaWatcherService } from '@fuse/services/media-watcher'
import { ToastrService } from 'ngx-toastr'
import { SelectionModel } from '@angular/cdk/collections'
import { GRAPHQL } from '../modules.graphql'
import { Apollo } from 'apollo-angular'
import { ExcelService } from 'app/core/excel.service'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MultiEditDialogComponent } from './dialogs/multiedit/dialog.component'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { MultiAddDialogComponent } from './dialogs/multiadd/dialog.component'
import { moduleConfig } from '../module.config'

@Component({
  selector: moduleConfig.type + '-' + moduleConfig.type2 + '-list',
  templateUrl: './module.component.html',
  styles: [
    `
      .${moduleConfig.type}-${moduleConfig.type2}-grid {
        grid-template-columns:  25px  minmax(256px, auto) 96px 96px 96px ;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.None,
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
    SidebarComponent,
    MultiEditDialogComponent,
    MatProgressSpinnerModule,
    RouterLink,
    CdkScrollable,
    
  ],
})
export class BaseModulesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatDrawer) private matDrawer: MatDrawer

  moduleConfig = moduleConfig
  title: string = moduleConfig.title
  @ViewChild(MatPaginator) private _paginator: MatPaginator
  @ViewChild(MatSort) private _sort: MatSort
  drawerMode: 'over' | 'side' = 'side'
  drawerOpened: boolean = moduleConfig.sideBarOpen
  items$: Observable<BaseItem[]>
  itemsAll: BaseItem[]
  editMode: boolean = false
  searchInput: string = ''
  canCopy: boolean = true;

  settingType: string = moduleConfig.type2



  flashMessage: 'success' | 'error' | null = null
  isLoading: boolean = false
  pagination: ItemPagination
  searchInputControl: UntypedFormControl = new UntypedFormControl()
  selectedItem: BaseItem | null = null
  selectedItemForm: UntypedFormGroup

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  initialSelection = []
  allowMultiSelect = true
  selection = new SelectionModel<string>(this.allowMultiSelect, this.initialSelection)
  private _graphql = GRAPHQL
  isExcellLoading: boolean = false

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _itemService: ModulesService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _toastr: ToastrService,
    private _excelService: ExcelService,
    public dialog: MatDialog,
    private _apollo : Apollo
  ) {}

  ngOnInit(): void {

    this.settingType = this._itemService.settingType;

    this._itemService._drawer.pipe(takeUntil(this._unsubscribeAll)).subscribe((drawer) => {
      this.matDrawer.toggle()
    })

    this.searchInputControl.setValue(this._itemService.searchInput)

    this.createItemForm()

    this._itemService.pagination$.pipe(takeUntil(this._unsubscribeAll)).subscribe((pagination: ItemPagination) => {
      this.pagination = pagination
      this._changeDetectorRef.markForCheck()
    })
    this._itemService._pathParameter.pipe(takeUntil(this._unsubscribeAll)).subscribe((pathParameter) => {
      if (pathParameter) {
        this.selection.clear()
      }
    })
    this._itemService._filter.pipe(takeUntil(this._unsubscribeAll)).subscribe((filter) => {
      if (filter) {
        this.selection.clear()
      }
    })
    this.items$ = this._itemService.items$
    this.items$.subscribe((items) => {
      this.itemsAll = items
      this._changeDetectorRef.markForCheck()
    })

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.closeDetails()
          this.isLoading = true
          this.searchInput = query
          return this._itemService.getitems(
            0,
            this._paginator?.pageSize ?? 50,
            this._sort?.active ?? 'createdAt',
            this._sort?.direction ?? 'desc',
            this.searchInput,
          )
        }),
        map(() => {
          this.isLoading = false
        }),
      )
      .subscribe()

    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side'
        this.drawerOpened = true
      } else {
        this.drawerMode = 'over'
        this.drawerOpened = false
      }
    })

    this._apollo.subscribe({
            query: this._graphql.subscribeToItem,
            variables: {
              type: this.settingType
            }
          }).pipe(takeUntil(this._unsubscribeAll)).subscribe((result: any) => {            
            if (result.data?.newSettingSub) {
              this._itemService.updateList(result.data.newSettingSub).subscribe()

                //this._toastr.success(result.data.newSettingSub.id, 'New Notify');
            }
          });
  }


  

  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      this._sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.closeDetails()
      })
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.closeDetails()
            this.isLoading = true
            return this._itemService.getitems(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction)
          }),
          map(() => {
            this.isLoading = false
          }),
        )
        .subscribe()
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null)
    this._unsubscribeAll.complete()
  }

  createItemForm(): void {
    this.selectedItemForm = this._formBuilder.group({
      id: [null],
      title: [null, [Validators.required]],
      isActive: [false],
      siraNo: [9999, [Validators.required]],
      type: [null],
    })
  }

  createItem(): void {
    this._itemService.createitem().subscribe((newProduct) => {
      this.editMode = true
      this.canCopy = false
      this.selectedItemForm.reset()
      this.selectedItem = newProduct
      this.selectedItemForm.patchValue(newProduct)
      this._changeDetectorRef.markForCheck()
    })
  }

  copyItem(item): void {
    this._itemService.createitem().subscribe((newProduct) => {
      this.editMode = true
      this.canCopy = false
      this.selectedItemForm.reset()
      this.selectedItem = newProduct
      newProduct.siraNo = item.siraNo + 1
      this.selectedItemForm.patchValue(item)
      this.selectedItemForm.patchValue(newProduct)
      this._changeDetectorRef.markForCheck()
    })
  }

  toggleDetails(itemId: string): void {
    if (this.selectedItem && this.selectedItem.id === itemId) {
      this.closeDetails()
      this.editMode ? this._itemService.deleteitem(itemId).subscribe() : null
      this.editMode = false
      this.canCopy = true
      return
    }
    this.editMode ? this._itemService.deleteitem(this.selectedItem.id).subscribe() : null

    this._itemService.getitemById(itemId).subscribe((product) => {
      this.selectedItemForm.reset()
      this.editMode = false
      this.canCopy = true
      this.selectedItem = product
      this.selectedItemForm.patchValue(product)
      this._changeDetectorRef.markForCheck()
    })
  }

  closeDetails(): void {
    this.selectedItem = null
  }

  updateSelectedItem(): void {
    const product = this.selectedItemForm.getRawValue()
    this._itemService.updateitem(this.selectedItem.id, product).subscribe(() => {
      this.editMode = false
      this.canCopy = true
      this.closeDetails()
      this._changeDetectorRef.markForCheck()
      this._toastr.success('Kayıt Eklendi / Güncellendi', 'Başarılı', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      })
    })
  }

  isAllSelected() {
    let returndata = true
    for (const row of this.itemsAll) {
      if (!this.selection.selected.includes(row.id)) {
        returndata = false
        break
      }
    }
    return returndata
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.itemsAll.forEach((row) => this.selection.deselect(row.id))
    } else {
      this.itemsAll.forEach((row) => this.selection.select(row.id))
    }
    this._changeDetectorRef.markForCheck()
  }

  trackByFn(index: number, item: any): any {
    return item.id || index
  }

  exportData(justSelected: boolean): void {
    this.isExcellLoading = true
    this._apollo
      .watchQuery<any>({
        query: this._graphql.getPagination,
        variables: {
          page: 0,
          size: 10000,
          sort: this._itemService.sort,
          order: this._itemService.order,
          search: this._itemService.searchInput,
          filter: this._itemService.filter,
          status: this._itemService.pathParameter,
          selectedIds: justSelected ? this.selection.selected : null,
          type: this.settingType
        },
      })
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ data, loading }) => {
        this.exportToexcel(data.basesettingsPegination.items)
        this._changeDetectorRef.markForCheck()
      })
  }

  exportToexcel(dataExport): void {
    const exportList = dataExport
    const readyToExport = []
    let data = {}
    for (const item of exportList) {
      data = {
        'Tanım': item.title,
        'Açıklama': item.subtitle,
        'Sıra No': item.siraNo,
        'İkon': item.icon,
        'Aktif?': item.isActive
      }
      readyToExport.push(data)
    }

    this._excelService.exportAsExcelFile(readyToExport, this.title)
    this.isExcellLoading = false
  }

  openMultiEditDialog(): void{
        
    const dialogRef = this.dialog.open(MultiEditDialogComponent, {
        data: {
          dialogTitle: 'Seçilen Kayıtları Düzenle',
          selectedIds: this.selection.selected,
        },
      });

    dialogRef.afterClosed().subscribe((result) => {
        if(!result) {
          return false;
        } else {
          this.selection.clear()
          this._toastr.success('Seçilen Kayıtlar Güncellendi', 'Başarılı', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-center',
          })
        }
        this._changeDetectorRef.markForCheck();

    });
  }
 openMultiAddDialogComponent(): void{
        
    const dialogRef = this.dialog.open(MultiAddDialogComponent, {
        data: {
          dialogTitle: 'Çoklu Kayıt Ekle',
          settingType: this.settingType
        },
      });

    dialogRef.afterClosed().subscribe((result) => {
        if(!result) {
          return false;
        } else {
          this.selection.clear()
          this._toastr.success('Seçilen Kayıtlar Güncellendi', 'Başarılı', {
            closeButton: true,
            progressBar: true,
            positionClass: 'toast-top-center',
          })
        }
        this._changeDetectorRef.markForCheck();

    });
  }

  
}
