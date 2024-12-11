import { TextFieldModule } from '@angular/cdk/text-field';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { User } from 'app/core/user/user.types';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { PROFILE } from '../settings.graphql';
import { UserService } from 'app/core/user/user.service';
import { Apollo } from 'apollo-angular';
import { FileUploaderComponent } from 'app/layout/common/fileuploader/fileuploader.component';
import { MatDialog } from '@angular/material/dialog';
import { config } from 'frontend.config';

@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        TextFieldModule,
        MatSelectModule,
        MatOptionModule,
        MatButtonModule,
        NgxMaskDirective,
        ToastrModule
    ],
    providers: [
        provideNgxMask(),
    ],
})
export class SettingsAccountComponent implements OnInit {
    accountForm: UntypedFormGroup;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    user: User;
    url = config.apiUrl
    changeAvatar = false;
    changeHeaderPic = false;
    private _graphql = PROFILE;
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        private _apollo: Apollo,
        private _toastr: ToastrService
    
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this._userService.user$
        .pipe(takeUntil(this._unsubscribeAll))
        .subscribe((user: User) =>
        {
            this.user = user;                                
            this.accountForm = this.createAccountForm();
            this._changeDetectorRef.markForCheck();
        });
    }

    createAccountForm(): any {
        return this._formBuilder.group({
            firstname   : [this.user.firstname, Validators.required],
            lastname    : [this.user.lastname, Validators.required],
            title   : [this.user.title],
            address : [this.user.address],
            about   : [this.user.about],
            phone   : [this.user.phone],
            avatar : [this.user.avatar],
            headerPic : [this.user.headerPic],
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
                    dialogTitle: 'Profil Resmi Yükle'
                }
        },
          });

        dialogRef.afterClosed().subscribe((result) => {
            if(!result) {
                return;
            } else {
               this.changeAvatar = true;
               this.user.avatar = result;
               this.accountForm.controls.avatar.setValue(result);
               this.accountForm.controls['firstname'].markAsDirty();
               this._changeDetectorRef.markForCheck();

            }
        });
      }

      changeProfileHeader(): void{
        
        const dialogRef = this.dialog.open(FileUploaderComponent, {
            data: {
                cropperOptions: {
                    maintainAspectRatio: true,
                    containWithinAspectRatio: false,
                    resizeToWidth: 2160,
                    resizeToHeight: 1440,
                    aspectRatio: 216/144,
                    dialogTitle: 'Kapak Fotoğrafı Yükle'
                }
        },
          });

        dialogRef.afterClosed().subscribe((result) => {
            if(!result) {
                return;
            } else {
               this.changeHeaderPic = true;
               this.user.headerPic = result;
               this.accountForm.controls.headerPic.setValue(result);
               this.accountForm.controls['firstname'].markAsDirty();
               this._changeDetectorRef.markForCheck();

            }
        });
      }
    

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    async save(): Promise<void> {
        const user = this.accountForm.getRawValue();        
        this._apollo.mutate<any>({
            mutation: this._graphql.updateProfile,
            variables: {
                user: user,
                changeAvatar: this.changeAvatar,
                changeHeaderPic: this.changeHeaderPic
            }
          }).subscribe((result: any) => {
            this._userService.user = result.data.updateProfile.user;
            this._toastr.success('Profil Bilgileriniz Güncellendi','Başarılı');
            this.changeAvatar = false;
            this.changeHeaderPic = false;
            this._changeDetectorRef.markForCheck();
          },
          (response) =>
          {                    
            this._toastr.error('Profil Bilgileriniz Güncellenemedi','Hata');
          },);
    } 
}
