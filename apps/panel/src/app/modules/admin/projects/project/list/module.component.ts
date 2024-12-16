import { CommonModule } from '@angular/common'
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core'
import { FormsModule, ReactiveFormsModule, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms'
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
import { debounceTime, distinctUntilChanged, from, fromEvent, map, merge, Observable, of, Subject, switchMap, takeUntil } from 'rxjs'
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
import { SelectSearchComponent } from 'app/core/selectsearchcomp/selectsearch.component'
import { MatDividerModule } from '@angular/material/divider'
import { GoogleMap, MapMarker, MapGeocoder } from '@angular/google-maps';
import { FileUploaderComponent } from 'app/layout/common/fileuploader/fileuploader.component'
import { config } from 'frontend.config'

@Component({
  selector: moduleConfig.type + '-' + moduleConfig.type2 + '-list',
  templateUrl: './module.component.html',
  styles: [
    `
      .${moduleConfig.type}-${moduleConfig.type2}-grid {
        grid-template-columns:  25px  minmax(256px, auto)  96px 96px 96px ;
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
    MatProgressSpinnerModule,
    SelectSearchComponent,
    GoogleMap,
    MapMarker,
    MatDividerModule
  ],
})
export class BaseModulesListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatDrawer) private matDrawer: MatDrawer
  private mapGeocoder = inject(MapGeocoder);

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
  changeAvatar: boolean = false;
  settingType: string = moduleConfig.type2

  url: string = config.apiUrl



  flashMessage: 'success' | 'error' | null = null
  isLoading: boolean = false
  pagination: ItemPagination
  searchInputControl: UntypedFormControl = new UntypedFormControl()
  selectedItem: BaseItem | null = null
  selectedItemForm: UntypedFormGroup
  selects: any;

  private _unsubscribeAll: Subject<any> = new Subject<any>()

  initialSelection = []
  allowMultiSelect = true
  selection = new SelectionModel<string>(this.allowMultiSelect, this.initialSelection)
  private _graphql = GRAPHQL
  isExcellLoading: boolean = false


  center: google.maps.LatLngLiteral = { lat: 25.1008631334436, lng: 55.16967033686541 };
  zoom = 9;
  items: any[] = [];
  display: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    disableDefaultUI: true,
    mapTypeId: 'roadmap',
    mapTypeControlOptions: {
      style: 0,
      position: 7,
    },
  };
  markerOptions: google.maps.MarkerOptions = { draggable: false };
  markerPositions: google.maps.LatLngLiteral[] = [];

  center_sale: google.maps.LatLngLiteral = { lat: 25.1008631334436, lng: 55.16967033686541 };
  zoom_sale = 9;
  markerPositions_sale: google.maps.LatLngLiteral[] = [];


  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _itemService: ModulesService,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _toastr: ToastrService,
    private _excelService: ExcelService,
    public dialog: MatDialog,
    private _apollo : Apollo,
    private ngZone: NgZone
  ) {
  }

  fc(control: string) {
    return this.selectedItemForm.get(control) as UntypedFormControl;
  }

  ngOnInit(): void {

    this.settingType = this._itemService.settingType;

    this._itemService._selects.pipe(takeUntil(this._unsubscribeAll)).subscribe((selects) => {
      this.selects = selects;
    });

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
            if (result.data?.itemSub) {
              this._itemService.updateList(result.data.itemSub).subscribe()
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
      developer: [null, [Validators.required]],
      mcompany: [null],
      description: [null],
      isActive: [false],
      phone: this._formBuilder.array([]),
      socialMediaAccounts: this._formBuilder.array([]),
      projectUnits_dld: this._formBuilder.array([]),
      email: [null],
      address: [null],
      address_sale: [null],
      title_dld: [null],
      dldId: [null],
      units_dld: [null],
      bank_dld: [null],
      bankaccount_dld: [null],
      registedAt_dld: [null],
      startedAt_dld: [null],
      finishedAt_dld: [null],
      area_dld: [null],
      website: [null],
      location: [null],
      location_sale: [null],
      type: [null],
      logo: [null],
    })
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

  addUnitField(): void {
    // Create an empty phone number form group
    const unitFormGroup = this._formBuilder.group({
      usagetype: [],
      propertytype: [],
      units: [],
    });

    // Add the phone number form group to the phoneNumbers form array
    (this.selectedItemForm.get('projectUnits_dld') as UntypedFormArray).push(unitFormGroup);

    // Mark for check
    this._changeDetectorRef.markForCheck();
  }

  removeUnitField(index: number): void {
    // Get form array for phone numbers
    const phoneNumbersFormArray = this.selectedItemForm.get('projectUnits_dld') as UntypedFormArray;

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
      this.editMode = true
      this.canCopy = false
      this.selectedItemForm.reset()
      this.selectedItemForm.reset();
      const socialMediaAccountsFormArray = this.selectedItemForm.get('socialMediaAccounts') as UntypedFormArray;
      socialMediaAccountsFormArray.clear();
      const phoneNumbersFormArray = this.selectedItemForm.get('phone') as UntypedFormArray;
      phoneNumbersFormArray.clear();
      const unitFormArray = this.selectedItemForm.get('projectUnits_dld') as UntypedFormArray;
      unitFormArray.clear();
      this.addSocialMediaAccountField();
      this.addPhoneNumberField();
      this.addUnitField();
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
      
      this.selectedItemForm.reset();
      const socialMediaAccountsFormArray = this.selectedItemForm.get('socialMediaAccounts') as UntypedFormArray;
      socialMediaAccountsFormArray.clear();
      const phoneNumbersFormArray = this.selectedItemForm.get('phone') as UntypedFormArray;
      phoneNumbersFormArray.clear();
      const unitFormArray = this.selectedItemForm.get('projectUnits_dld') as UntypedFormArray;
      unitFormArray.clear();
      this.editMode = false
      this.canCopy = true
      this.selectedItem = product
      this.selectedItemForm.patchValue(product)
      this.selectedItemForm.controls['developer'].setValue(product.developer?.id);
      this.selectedItemForm.controls['mcompany'].setValue(product.mcompany?.id);
      if(product.location && product.location.coordinates && product.location.coordinates.length > 0){
        this.setCenterMapWithZoom(product.location.coordinates[1], product.location.coordinates[0], 15);
      }
      if(product.location_sale && product.location_sale.coordinates && product.location_sale.coordinates.length > 0){
        this.setCenterMapWithZoom_sale(product.location_sale.coordinates[1], product.location_sale.coordinates[0], 15);
      }
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

      const unitFormGroups = [];
      if (product?.projectUnits_dld?.length > 0) {
        product.projectUnits_dld.forEach((unit) => {
          unitFormGroups.push(this._formBuilder.group({
            usagetype: [unit.usagetype?.id],
            propertytype: [unit.propertytype?.id],
            units: [unit.units],
          }));
        });
      }
      unitFormGroups.forEach((unitFormGroup) => {
        (this.selectedItemForm.get('projectUnits_dld') as UntypedFormArray).push(unitFormGroup);
      });
      this._changeDetectorRef.markForCheck()
    })
  }
  changeProfilePic(): void{
        
        const dialogRef = this.dialog.open(FileUploaderComponent, {
            data: {
                cropperOptions: {
                    maintainAspectRatio: true,
                    containWithinAspectRatio: false,
                    resizeToWidth: 1920,
                    resizeToHeight: 1080,
                    aspectRatio: 1920 / 1080,
                    dialogTitle: 'Proje Kapak Fotoğrafı Yükle'
                }
        },
          });

        dialogRef.afterClosed().subscribe((result) => {
            if(!result) {
                return;
            } else {
               this.changeAvatar = true;
               this.selectedItem.logo = result;
               this.selectedItemForm.controls.logo.setValue(result);
               this.selectedItemForm.controls['title'].markAsDirty();
               this._changeDetectorRef.markForCheck();

            }
        });
      }
  closeDetails(): void {
    this.selectedItem = null
  }

  updateSelectedItem(): void {
    const product = this.selectedItemForm.getRawValue()
    product.phone = product.phone.filter((phone) => phone.phoneType && phone.phone);
    product.socialMediaAccounts = product.socialMediaAccounts.filter(
      (socialMediaAccount) => socialMediaAccount.platform && socialMediaAccount.username,
    );
    product.projectUnits_dld = product.projectUnits_dld.filter((unit) => unit.usagetype && unit.propertytype && unit.units);

    this._itemService.updateitem(this.selectedItem.id, product, this.changeAvatar).subscribe(() => {
      this.editMode = false
      this.canCopy = true
      this.changeAvatar = false;
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

  setCenterMapWithZoom(lat: number, lng: number, zoom: number): void {
    this.center = { lat, lng };
    this.zoom = zoom;
    this.markerPositions[0] = { lat, lng };
    this.selectedItemForm.controls['location'].setValue({
      type: 'Point',
      coordinates: [lng, lat],
    });

    this._changeDetectorRef.markForCheck();
  }

  setCenterMapWithZoom_sale(lat: number, lng: number, zoom: number): void {
    this.center_sale = { lat, lng };
    this.zoom_sale = zoom;
    this.markerPositions_sale[0] = { lat, lng };
    this.selectedItemForm.controls['location_sale'].setValue({
      type: 'Point',
      coordinates: [lng, lat],
    });
    this._changeDetectorRef.markForCheck();
  }

  findFromAddress(address: string): void {
    this.mapGeocoder.geocode({
      address: address
    }).subscribe(response => {
      if (response.results?.[0]) {
        const location = response.results[0].geometry.location;
        this.setCenterMapWithZoom(
          location.lat(),
          location.lng(),
          15
        );
      } else {
        this._toastr.error('Adres Bulunamadı', 'Hata', {
          closeButton: true,
          progressBar: true,
          positionClass: 'toast-top-center',
        })
      }
    });
  }

  findFromAddress_sale(address: string): void {
    this.mapGeocoder.geocode({
      address: address
    }).subscribe(response => {
      if (response.results?.[0]) {
        const location = response.results[0].geometry.location;
        this.setCenterMapWithZoom_sale(location.lat(), location.lng(), 15);
      }
    });
  }

  moveMap(event: google.maps.MapMouseEvent) {
    this.center = event.latLng.toJSON();
    this.markerPositions[0] = event.latLng.toJSON();
    this.selectedItemForm.controls['location'].setValue({
      type: 'Point',
      coordinates: [event.latLng.toJSON().lng, event.latLng.toJSON().lat],
    });
  }

  moveMap_sale(event: google.maps.MapMouseEvent) {
    this.center_sale = event.latLng.toJSON();
    this.markerPositions_sale[0] = event.latLng.toJSON();
    this.selectedItemForm.controls['location_sale'].setValue({
      type: 'Point',
      coordinates: [event.latLng.toJSON().lng, event.latLng.toJSON().lat],
    });
  }
}
