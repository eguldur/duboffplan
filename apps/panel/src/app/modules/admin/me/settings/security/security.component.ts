import { CommonModule } from '@angular/common';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FuseValidators } from '@fuse/validators';
import { Apollo } from 'apollo-angular';
import { ToastrService } from 'ngx-toastr';
import { PROFILE } from '../settings.graphql';

@Component({
    selector: 'settings-security',
    templateUrl: './security.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatButtonModule,
    ],
})
export class SettingsSecurityComponent implements OnInit {
    securityForm: UntypedFormGroup;
    private _graphql = PROFILE;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder,
        private _apollo: Apollo,
        private _toastr: ToastrService,
        private _changeDetectorRef: ChangeDetectorRef
    ) {}
    get f(){
        return this.securityForm.controls;
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.securityForm = this._formBuilder.group({
            currentPassword  : ['', [Validators.required, Validators.minLength(8)]],
            password       : ['', [Validators.required, Validators.minLength(8), Validators.pattern(
                // eslint-disable-next-line no-useless-escape
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\.@#\$%\^&\*])(?=.{8,})/
              )]],
            passwordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.pattern(
                // eslint-disable-next-line no-useless-escape
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\.@#\$%\^&\*])(?=.{8,})/
              )]],
        },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
            });
    }

    async save(): Promise<void> {
        const user = this.securityForm.getRawValue();        
        this._apollo.mutate<any>({
            mutation: this._graphql.updatePassword,
            variables: {
                password: user.currentPassword,
                newPassword: user.password
            }
          }).subscribe((result: any) => {
            this._toastr.success('Şifreniz Güncellendi','Başarılı');
            this.securityForm.reset();

            this._changeDetectorRef.markForCheck();
          }, (error) => {
            this._toastr.error('Şifreniz Güncellenemedi','Hata');
            this._changeDetectorRef.markForCheck();
            });
    } 
}
