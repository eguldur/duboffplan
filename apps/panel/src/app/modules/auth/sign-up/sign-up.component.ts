import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { config } from 'frontend.config';
import { NgxTurnstileFormsModule, NgxTurnstileModule } from 'ngx-turnstile';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'auth-sign-up',
  templateUrl: './sign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,
  imports: [
    RouterLink,
    FuseAlertComponent,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule, NgxTurnstileModule, NgxTurnstileFormsModule
  ],
})
export class AuthSignUpComponent implements OnInit {
  @ViewChild('signUpNgForm') signUpNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signUpForm: UntypedFormGroup;
  showAlert = false;
  siteKey = config.siteKey;
  authconf = config.auth;
  recaptchaForm: FormGroup;
  /**
   * Constructor
   */
  constructor(
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.recaptchaForm = this.setReCaptchaForm();

    // Create the form
    this.signUpForm = this._formBuilder.group(
      {
        firstname: ['', Validators.required],
        lastname: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              // eslint-disable-next-line no-useless-escape
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\.@#\$%\^&\*])(?=.{8,})/,
            ),
          ],
        ],
        passwordConfirm: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              // eslint-disable-next-line no-useless-escape
              /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!\.@#\$%\^&\*])(?=.{8,})/,
            ),
          ],
        ],
        agreements: [false, Validators.requiredTrue],
        recaptcha: ['', Validators.required],
      },
      {
        validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
      },
    );
  }
  get f() {
    return this.signUpForm.controls;
  }
  sendCaptchaResponse(captchaResponse: string) {
    this.signUpForm.controls['recaptcha'].setValue(captchaResponse);
    this._changeDetectorRef.markForCheck();
  }
  setReCaptchaForm(): any {
    this._changeDetectorRef.markForCheck();
    return this._formBuilder.group({
      recaptcha: ['', [Validators.required]],
    });
  }
  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign up
   */
  signUp(): void {
    // Do nothing if the form is invalid
    if (this.signUpForm.invalid) {
      return;
    }

    // Disable the form
    this.signUpForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign up
    this._authService.signUp(this.signUpForm.value).subscribe(
      (response) => {
        // Navigate to the confirmation required page
        this._router.navigateByUrl('/confirmation-required');
      },
      (response) => {
        this.signUpForm.enable();
        this.signUpNgForm.resetForm();
        this.recaptchaForm.reset();
        this.alert = {
          type: 'error',
          message: response.toString().replace('ApolloError: ', ''),
        };
        this.showAlert = true;
      },
    );
  }
}
