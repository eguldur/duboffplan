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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { config } from 'frontend.config';
import { NgxTurnstileModule, NgxTurnstileFormsModule } from 'ngx-turnstile';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'auth-sign-in',
  templateUrl: './sign-in.component.html',
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
    MatProgressSpinnerModule,
    NgxTurnstileModule,
    NgxTurnstileFormsModule,
  ],
})
export class AuthSignInComponent implements OnInit {
  @ViewChild('signInNgForm') signInNgForm: NgForm;

  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  signInForm: UntypedFormGroup;
  showAlert = false;
  recaptchaForm: FormGroup;
  siteKey = config.siteKey;
  authconf = config.auth;

  /**
   * Constructor
   */
  constructor(
    private _activatedRoute: ActivatedRoute,
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
    // Create the form
    this.recaptchaForm = this.setReCaptchaForm();
    this.signInForm = this._formBuilder.group({
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
      rememberMe: [false],
      recaptcha: ['', Validators.required],
    });
    this._changeDetectorRef.markForCheck();
  }

  get f() {
    return this.signInForm.controls;
  }
  sendCaptchaResponse(captchaResponse: string): any {
    this.signInForm.controls['recaptcha'].setValue(captchaResponse);

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
   * Sign in
   */
  signIn(): void {
    // Return if the form is invalid

    if (this.signInForm.invalid) {
      return;
    }

    // Disable the form
    this.signInForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Sign in
    this._authService.signIn(this.signInForm.value).subscribe(
      () => {
        const redirectURL =
          this._activatedRoute.snapshot.queryParamMap.get('redirectURL') ||
          '/signed-in-redirect';
        this._router.navigateByUrl(redirectURL);
      },
      (response) => {
        this.signInForm.enable();
        this.signInNgForm.resetForm();
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
