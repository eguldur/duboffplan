import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { Apollo, ApolloModule } from 'apollo-angular';
import { AUTH } from './auth.graphql';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private _apollo = inject(Apollo)
    private _graphql = AUTH;
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string, recaptcha: string): Observable<any>
    {
        return this._apollo.mutate<any>({
            mutation: this._graphql.sendPasswordResetEmail,
            variables: {
                email: email,
                recaptcha: recaptcha
            }
          });
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string, token:string, recaptcha:string): Observable<any>
    {
        return this._apollo.mutate<any>({
            mutation: this._graphql.resetPassword,
            variables: {
                password: password,
                passwordResetToken: token,
                recaptcha: recaptcha
            }
          });
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string, recaptcha: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._apollo.mutate<any>({
            mutation: this._graphql.singin,
            variables: {
                email: credentials.email,
                password: credentials.password,
                recaptcha: credentials.recaptcha
            }
          }).pipe(
            switchMap((response: any) =>
            {                
                this.accessToken = response.data.login.accessToken;
                this._authenticated = true;
                this._userService.user = response.data.login.user;
                return of(response);
            }),
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        return this._apollo.mutate<any>({
            mutation: this._graphql.signInUsingToken,
            variables: {
                accessToken:  this.accessToken
            }
          }).pipe(
            catchError(() => {
                this.signOut();
                return of(false);
            }

            ),
            switchMap((response: any) =>
            {
                if ( response?.data?.signInUsingToken?.accessToken )
                {
                    this.accessToken = response.data.signInUsingToken.accessToken;
                    this._authenticated = true;
                    this._userService.user = response.data.signInUsingToken.user;
                    return of(true);

                } else {
                    return of(false);
                }
                
            }),
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { firstname: string; lastname: string; email: string; password: string; company: string; recaptcha: string;  }): Observable<any>
    {
        if ( this._authenticated )
            {
                return throwError('User is already logged in.');
            }
            return this._apollo.mutate<any>({
                mutation: this._graphql.singup,
                variables: {
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    password: user.password,
                    recaptcha: user.recaptcha
                }
              });
    }
    confirmEmail(cofirmEmailToken: string): Observable<any>
    {
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }
        return this._apollo.mutate<any>({
            mutation: this._graphql.cofirmEmailToken,
            variables: {
                cofirmEmailToken: cofirmEmailToken
            }
          });
    }
    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }
}
