import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { map, Observable, ReplaySubject, tap } from 'rxjs';
import { GRAPHQL } from './navigation.graphql';
import { Apollo } from 'apollo-angular';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _apollo = inject(Apollo)
    private _graphql = GRAPHQL;
    private _navigation: ReplaySubject<Navigation> =
        new ReplaySubject<Navigation>(1);

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        return this._apollo
            .watchQuery<any>({
            query: this._graphql.getNavigation,
            })
            .valueChanges.pipe(
            map(({ data, loading }) => {                
                this._navigation.next({compact: data.navigation, default: data.navigation, futuristic: data.navigation, horizontal: data.navigation});
                return {compact: data.navigation, default: data.navigation, futuristic: data.navigation, horizontal: data.navigation}
            })
        );
    }
}
