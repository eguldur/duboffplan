import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { ModulesService } from '../modules.service';
import { ItemPagination, BaseItem } from '../modules.types';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { SidebarComponent } from './leftsidebar/sidebar.component';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { ToastrService } from 'ngx-toastr';
import { SelectionModel } from '@angular/cdk/collections';
import { GRAPHQL } from '../modules.graphql';
import { Apollo } from 'apollo-angular';
import { ExcelService } from 'app/core/excel.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MultiEditDialogComponent } from './dialogs/multiedit/dialog.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MultiAddDialogComponent } from './dialogs/multiadd/dialog.component';
import { moduleConfig } from '../module.config';
import { SettingsSablonComponent } from '../modules.component';
import { SelectSearchComponent } from 'app/core/selectsearchcomp/selectsearch.component';
import { FileUploaderComponent } from 'app/layout/common/fileuploader/fileuploader.component';
import { config } from 'frontend.config';

@Component({
  selector: moduleConfig.type + '-' + moduleConfig.type2 + '-list',
  templateUrl: './module.component.html',
  styles: [
    `
      .${moduleConfig.type}-${moduleConfig.type2}-grid {
        grid-template-columns: 25px  minmax(200px, auto) 140px 168px 168px 140px 96px  96px  ;
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
    SettingsSablonComponent,
    SelectSearchComponent,
  ],
})
export class BaseModulesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatDrawer) private matDrawer: MatDrawer;

  moduleConfig = moduleConfig;
  title: string = moduleConfig.title;
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = moduleConfig.sideBarOpen;
  items$: Observable<BaseItem[]>;
  itemsAll: BaseItem[];
  editMode = false;
  searchInput = '';
  canCopy = true;
  selects: any;
  selectedItemForm: UntypedFormGroup;

  unitsSecond: any = [];
  unitsThird: any = [];
  unitsFourth: any = [];
  unitsFifth: any = [];
  unitsSixth: any = [];

  settingType: string = moduleConfig.type2;

  flashMessage: 'success' | 'error' | null = null;
  isLoading = false;
  pagination: ItemPagination;
  searchInputControl: UntypedFormControl = new UntypedFormControl();
  selectedItem: BaseItem | null = null;

  private _unsubscribeAll: Subject<any> = new Subject<any>();

  initialSelection = [];
  allowMultiSelect = true;
  selection = new SelectionModel<string>(this.allowMultiSelect, this.initialSelection);
  private _graphql = GRAPHQL;
  isExcellLoading = false;
  changeAvatar = false;
  url = config.apiUrl;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _itemService: ModulesService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _toastr: ToastrService,
    private _excelService: ExcelService,
    public dialog: MatDialog,
    private _apollo: Apollo,
  ) {}

  fc(controlName: string): UntypedFormControl {
    return this.selectedItemForm.get(controlName) as UntypedFormControl;
  }



  ngOnInit(): void {
    this.settingType = this._itemService.settingType;

    this._itemService.getSelects().subscribe(
      (data) => {
        this.selects = data;
        this._changeDetectorRef.markForCheck();
      },
      (error) => {},
    );

    this._itemService._drawer.pipe(takeUntil(this._unsubscribeAll)).subscribe((drawer) => {
      this.matDrawer.toggle();
    });

    this.searchInputControl.setValue(this._itemService.searchInput);

    this.createItemForm();
   

    this._itemService.pagination$.pipe(takeUntil(this._unsubscribeAll)).subscribe((pagination: ItemPagination) => {
      this.pagination = pagination;
      this._changeDetectorRef.markForCheck();
    });
    this._itemService._pathParameter.pipe(takeUntil(this._unsubscribeAll)).subscribe((pathParameter) => {
      if (pathParameter) {
        this.selection.clear();
      }
    });
    this._itemService._filter.pipe(takeUntil(this._unsubscribeAll)).subscribe((filter) => {
      if (filter) {
        this.selection.clear();
      }
    });
    this.items$ = this._itemService.items$;
    this.items$.subscribe((items) => {
      this.itemsAll = items;
      this._changeDetectorRef.markForCheck();
    });

    this.searchInputControl.valueChanges
      .pipe(
        takeUntil(this._unsubscribeAll),
        debounceTime(300),
        switchMap((query) => {
          this.closeDetails();
          this.isLoading = true;
          this.searchInput = query;
          return this._itemService.getitems(
            0,
            this._paginator?.pageSize ?? 50,
            this._sort?.active ?? 'createdAt',
            this._sort?.direction ?? 'desc',
            this.searchInput,
          );
        }),
        map(() => {
          this.isLoading = false;
        }),
      )
      .subscribe();

    this._fuseMediaWatcherService.onMediaChange$.pipe(takeUntil(this._unsubscribeAll)).subscribe(({ matchingAliases }) => {
      if (matchingAliases.includes('lg')) {
        this.drawerMode = 'side';
        this.drawerOpened = true;
      } else {
        this.drawerMode = 'over';
        this.drawerOpened = false;
      }
    });

    this._apollo
      .subscribe({
        query: this._graphql.subscribeToItem,
        variables: {
          type: this.settingType,
        },
      })
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((result: any) => {
        if (result.data?.itemSub) {
          this._itemService.updateList(result.data.itemSub).subscribe();

          //this._toastr.success(result.data.newSettingSub.id, 'New Notify');
        }
      });
  }

  ngAfterViewInit(): void {
    if (this._sort && this._paginator) {
      this._sort.sortChange.pipe(takeUntil(this._unsubscribeAll)).subscribe(() => {
        this.closeDetails();
      });
      merge(this._sort.sortChange, this._paginator.page)
        .pipe(
          switchMap(() => {
            this.closeDetails();
            this.isLoading = true;
            return this._itemService.getitems(this._paginator.pageIndex, this._paginator.pageSize, this._sort.active, this._sort.direction);
          }),
          map(() => {
            this.isLoading = false;
          }),
        )
        .subscribe();
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  createItemForm(): void {
    this.selectedItemForm = this._formBuilder.group({
      id: [null],
      fullName: [null],
      email: [null],
      phone: this._formBuilder.array([]),
      socialMediaAccounts: this._formBuilder.array([]),
      developer: [null],
      unvan: [null],
      type: [null],
      isActive: [null],
      avatar: [null],
    });
  }
  changeProfilePic(): void{
        
        const dialogRef = this.dialog.open(FileUploaderComponent, {
            data: {
                cropperOptions: {
                    maintainAspectRatio: true,
                    containWithinAspectRatio: false,
                    resizeToWidth: 400,
                    resizeToHeight: 400,
                    aspectRatio: 1,
                    dialogTitle: 'Contact Profil Resmi Yükle'
                }
        },
          });

        dialogRef.afterClosed().subscribe((result) => {
            if(!result) {
                return;
            } else {
               this.changeAvatar = true;
               this.selectedItem.avatar = result;
               this.selectedItemForm.controls.avatar.setValue(result);
               this.selectedItemForm.controls['fullName'].markAsDirty();
               this._changeDetectorRef.markForCheck();

            }
        });
      }
  addPhoneNumberField(): void {
    // Create an empty phone number form group
    const phoneNumberFormGroup = this._formBuilder.group({
      phone: [],
      phoneType: [],
    });

    // Add the phone number form group to the phoneNumbers form array
    (this.selectedItemForm.get('phone') as UntypedFormArray).push(phoneNumberFormGroup);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  removePhoneNumberField(index: number): void {
    // Get form array for phone numbers
    const phoneNumbersFormArray = this.selectedItemForm.get('phone') as UntypedFormArray;

    // Remove the phone number field
    phoneNumbersFormArray.removeAt(index);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  addSocialMediaAccountField(): void {
    const socialMediaAccountFormGroup = this._formBuilder.group({
      platform: [],
      username: [],
    });

    (this.selectedItemForm.get('socialMediaAccounts') as UntypedFormArray).push(socialMediaAccountFormGroup);

    this._changeDetectorRef.markForCheck();
  }

  removeSocialMediaAccountField(index: number): void {
    const socialMediaAccountsFormArray = this.selectedItemForm.get('socialMediaAccounts') as UntypedFormArray;
    socialMediaAccountsFormArray.removeAt(index);
    this._changeDetectorRef.markForCheck();
  }

  createItem(): void {
    this._itemService.createitem().subscribe((newProduct) => {
      this.editMode = true;
      this.canCopy = false;
      this.selectedItemForm.reset();
      const socialMediaAccountsFormArray = this.selectedItemForm.get('socialMediaAccounts') as UntypedFormArray;
      socialMediaAccountsFormArray.clear();
      const phoneNumbersFormArray = this.selectedItemForm.get('phone') as UntypedFormArray;
      phoneNumbersFormArray.clear();
      this.addSocialMediaAccountField();
      this.addPhoneNumberField();
      this.selectedItem = newProduct;
      this.selectedItemForm.patchValue(newProduct);
      this._changeDetectorRef.markForCheck();
    });
  }

  copyItem(item): void {
    this._itemService.createitem().subscribe((newProduct) => {
      this.editMode = true;
      this.canCopy = false;
      this.selectedItemForm.reset();
      this.selectedItem = newProduct;
      newProduct.siraNo = item.siraNo + 1;
      this.selectedItemForm.patchValue(item);
      this.selectedItemForm.patchValue(newProduct);
      this._changeDetectorRef.markForCheck();
    });
  }

  toggleDetails(itemId: string): void {
    if (this.selectedItem && this.selectedItem.id === itemId) {
      this.closeDetails();
      this.editMode ? this._itemService.deleteitem(itemId).subscribe() : null;
      this.editMode = false;
      this.canCopy = true;
      return;
    }
    this.editMode ? this._itemService.deleteitem(this.selectedItem.id).subscribe() : null;

    this._itemService.getitemById(itemId).subscribe((product) => {
      this.selectedItemForm.reset();
      const socialMediaAccountsFormArray = this.selectedItemForm.get('socialMediaAccounts') as UntypedFormArray;
      socialMediaAccountsFormArray.clear();
      const phoneNumbersFormArray = this.selectedItemForm.get('phone') as UntypedFormArray;
      phoneNumbersFormArray.clear();

      this.editMode = false;
      this.canCopy = true;
      this.selectedItem = product;
      this.selectedItemForm.patchValue(product);
      this.selectedItemForm.controls['unvan'].setValue(product.unvan.id);
      this.selectedItemForm.controls['developer'].setValue(product.developer.map((developer) => developer.id));

      const phoneNumbersFormGroups = [];

      if (product?.phone?.length > 0) {
        // Iterate through them
        product.phone.forEach((phoneNumber) => {
          // Create an email form group
          phoneNumbersFormGroups.push(
            this._formBuilder.group({
              phone: [phoneNumber.phone],
              phoneType: [phoneNumber.phoneType.id],
            }),
          );
        });
      }
      // Add the phone numbers form groups to the phone numbers form array
      phoneNumbersFormGroups.forEach((phoneNumbersFormGroup) => {
        (this.selectedItemForm.get('phone') as UntypedFormArray).push(phoneNumbersFormGroup);
      });

      const socialMediaAccountsFormGroups = [];

      if (product?.socialMediaAccounts?.length > 0) {
        // Iterate through them
        product.socialMediaAccounts.forEach((socialMediaAccount) => {
          // Create an email form group
          socialMediaAccountsFormGroups.push(
            this._formBuilder.group({
              platform: [socialMediaAccount.platform.id],
              username: [socialMediaAccount.username],
            }),
          );
        });
      }
      // Add the phone numbers form groups to the phone numbers form array
      socialMediaAccountsFormGroups.forEach((socialMediaAccountsFormGroup) => {
        (this.selectedItemForm.get('socialMediaAccounts') as UntypedFormArray).push(socialMediaAccountsFormGroup);
      });

      this._changeDetectorRef.markForCheck();
    });
  }

  closeDetails(): void {
    this.selectedItem = null;
  }

  updateSelectedItem(): void {
    const product = this.selectedItemForm.getRawValue();
    product.phone = product.phone.filter((phone) => phone.phoneType && phone.phone);
    product.socialMediaAccounts = product.socialMediaAccounts.filter(
      (socialMediaAccount) => socialMediaAccount.platform && socialMediaAccount.username,
    );
   

    this._itemService.updateitem(this.selectedItem.id, product, this.changeAvatar).subscribe(() => {
      this.editMode = false;
      this.canCopy = true;
      this.closeDetails();
      this._changeDetectorRef.markForCheck();
      this._toastr.success('Kayıt Eklendi / Güncellendi', 'Başarılı', {
        closeButton: true,
        progressBar: true,
        positionClass: 'toast-top-center',
      });
    });
  }

  isAllSelected() {
    let returndata = true;
    for (const row of this.itemsAll) {
      if (!this.selection.selected.includes(row.id)) {
        returndata = false;
        break;
      }
    }
    return returndata;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.itemsAll.forEach((row) => this.selection.deselect(row.id));
    } else {
      this.itemsAll.forEach((row) => this.selection.select(row.id));
    }
    this._changeDetectorRef.markForCheck();
  }

  trackByFn(index: number, item: any): any {
    return item.id || index;
  }

  exportData(justSelected: boolean): void {
    this.isExcellLoading = true;
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
          type: this.settingType,
        },
      })
      .valueChanges.pipe(takeUntil(this._unsubscribeAll))
      .subscribe(({ data, loading }) => {
        this.exportToexcel(data.basesettingsPegination.items);
        this._changeDetectorRef.markForCheck();
      });
  }

  exportToexcel(dataExport): void {
    const exportList = dataExport;
    const readyToExport = [];
    let data = {};
    for (const item of exportList) {
      data = {
        Tanım: item.title,
        Açıklama: item.subtitle,
        'Sıra No': item.siraNo,
        İkon: item.icon,
        'Aktif?': item.isActive,
      };
      readyToExport.push(data);
    }

    this._excelService.exportAsExcelFile(readyToExport, this.title);
    this.isExcellLoading = false;
  }

  openMultiEditDialog(): void {
    const dialogRef = this.dialog.open(MultiEditDialogComponent, {
      data: {
        dialogTitle: 'Seçilen Kayıtları Düzenle',
        selectedIds: this.selection.selected,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return false;
      } else {
        this.selection.clear();
        this._toastr.success('Seçilen Kayıtlar Güncellendi', 'Başarılı', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      }
      this._changeDetectorRef.markForCheck();
    });
  }
  openMultiAddDialogComponent(): void {
    const dialogRef = this.dialog.open(MultiAddDialogComponent, {
      data: {
        dialogTitle: 'Çoklu Kayıt Ekle',
        settingType: this.settingType,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) {
        return false;
      } else {
        this.selection.clear();
        this._toastr.success('Seçilen Kayıtlar Güncellendi', 'Başarılı', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-center',
        });
      }
      this._changeDetectorRef.markForCheck();
    });
  }
}
