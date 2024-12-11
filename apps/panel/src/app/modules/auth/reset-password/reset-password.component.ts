/* eslint-disable @angular-eslint/component-selector */
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormGroup,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { config } from 'frontend.config';
import { finalize } from 'rxjs';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink, NgxTurnstileModule, NgxTurnstileFormsModule
    ],
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert = false;
    recaptchaForm: FormGroup
    siteKey= config.siteKey;
    authconf= config.auth;
    resetPassToken: string;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _route: ActivatedRoute,
    ) {
        this.resetPassToken = this._route.snapshot.paramMap.get('token');

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.recaptchaForm = this.setReCaptchaForm()

        // Create the form
        this.resetPasswordForm = this._formBuilder.group({
                password       : ['', [Validators.required, Validators.minLength(8), Validators.pattern(
                    // eslint-disable-next-line no-useless-escape
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\.@#\$%\^&\*])(?=.{8,})/
                  )]],
                passwordConfirm: ['', [Validators.required, Validators.minLength(8), Validators.pattern(
                    // eslint-disable-next-line no-useless-escape
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\.@#\$%\^&\*])(?=.{8,})/
                  )]],
                token: [this.resetPassToken, Validators.required],
                recaptcha   : ['', Validators.required],


            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
            },
        );
    }
    get f(){
        return this.resetPasswordForm.controls;
      }
    sendCaptchaResponse(captchaResponse: string) {
        this.resetPasswordForm.controls['recaptcha'].setValue(captchaResponse);
        this._changeDetectorRef.markForCheck();
      }
      setReCaptchaForm(): any {
        this._changeDetectorRef.markForCheck();
        return this._formBuilder.group({
          recaptcha: ['', [Validators.required]],
        })
    
      }
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    resetPassword(): void
    {
        // Return if the form is invalid
        if ( this.resetPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this._authService.resetPassword(this.resetPasswordForm.get('password').value, this.resetPasswordForm.get('token').value, this.resetPasswordForm.get('recaptcha').value)
            .pipe(
                finalize(() =>
                {
                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    this.recaptchaForm.reset();

                    // Show the alert
                    this.showAlert = true;
                }),
            )
            .subscribe(
                (response) =>
                {
                    // Set the alert
                    this.alert = {
                        type   : 'success',
                        message: 'Şifreniz Sıfırlandı. Giriş yapabilirsiniz.',
                    };
                },
                (response) =>
                {
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: 'Şifreniz sıfırlanırken bir hata oluştu. Lütfen tekrar deneyiniz.',
                    };
                },
            );
    }
}
