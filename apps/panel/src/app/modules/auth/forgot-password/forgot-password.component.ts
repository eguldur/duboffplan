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
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { config } from 'frontend.config';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';
import { finalize } from 'rxjs';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
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
        MatProgressSpinnerModule,
        RouterLink, NgxTurnstileModule, NgxTurnstileFormsModule
        
    ],
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup;
    showAlert = false;
    recaptchaForm: FormGroup
    siteKey= config.siteKey;
    authconf= config.auth;
    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,

    ) {}

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
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            recaptcha   : ['', Validators.required],
        });
    }
    sendCaptchaResponse(captchaResponse: string) {
        this.forgotPasswordForm.controls['recaptcha'].setValue(captchaResponse);
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
     * Send the reset link
     */
    sendResetLink(): void
    {
        // Return if the form is invalid
        if ( this.forgotPasswordForm.invalid )
        {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Forgot password
        this._authService.forgotPassword(this.forgotPasswordForm.get('email').value, this.forgotPasswordForm.get('recaptcha').value)
        .pipe(
            finalize(() =>
            {
                // Re-enable the form
                this.forgotPasswordForm.enable();

                // Reset the form
                this.forgotPasswordNgForm.resetForm();
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
                    message: 'Şifre sıfırlama bağlantısı e-mail adresinize gönderildi.',
                };
            },
            (response) =>
            {
                // Set the alert
                this.alert = {
                    type   : 'error',
                    message: 'Bir şeyler yanlış gitti, lütfen tekrar deneyin.',
                };
            },
        );
    }
}
