import { I18nPluralPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { Subject, finalize, takeUntil, takeWhile, tap, timer } from 'rxjs';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector     : 'auth-confirm-email',
    templateUrl  : './confirm-email.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [RouterLink, I18nPluralPipe, FuseAlertComponent],
})
export class CanfirmEmailComponent implements OnInit, OnDestroy {
    countdown = 5;
    countdownMapping: any = {
        '=1': '# saniye',
        other: '# saniye',
    };
    resetPassToken: string;
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    showAlert =  false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private _route: ActivatedRoute,
        private _changeDetectorRef: ChangeDetectorRef,
    ) {
        this.resetPassToken = this._route.snapshot.paramMap.get('token');

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Sign out
        this.countdown = 5;
        this._authService.confirmEmail(this.resetPassToken).subscribe(
            (response) =>
            {
                this.alert = {
                    type   : 'success',
                    message: 'E-mail adresiniz onaylandı. Giriş yapabilirsiniz.',
                };
                this.showAlert = true;
                this._changeDetectorRef.markForCheck();
                timer(1000, 1000)
                .pipe(
                    finalize(() =>
                    {
                        this._router.navigate(['sign-in']);
                    }),
                    takeWhile(() => this.countdown > 0),
                    takeUntil(this._unsubscribeAll),
                    tap(() => this.countdown--),
                )
                .subscribe();
            },
            (error) =>
            {
                this.alert = {
                    type   : 'error',
                    message: 'E-mail adresiniz onaylanamadı. Lütfen tekrar deneyiniz.',
                };
                this.showAlert = true;
                this._changeDetectorRef.markForCheck();
                timer(1000, 1000)
                .pipe(
                    finalize(() =>
                    {
                        this._router.navigate(['sign-in']);
                    }),
                    takeWhile(() => this.countdown > 0),
                    takeUntil(this._unsubscribeAll),
                    tap(() => this.countdown--),
                )
                .subscribe();
            },
        );
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
