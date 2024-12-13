import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
    private _data: BehaviorSubject<any> = new BehaviorSubject(null);
    private _data_real: BehaviorSubject<any> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, private _apollo: Apollo) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for data
     */
    get data$(): Observable<any> {
        return this._data.asObservable();
    }

    get data_real$(): Observable<any> {
        return this._data_real.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get data
     */
    getData(): Observable<any> {
        return this._httpClient.get('api/dashboards/analytics').pipe(
            tap((response: any) => {
                this._data.next(response);
            })
        );
    }

    getDataReal(): Observable<any> {
        return this._apollo.watchQuery({
            query: gql`
                query {
                    developer_count: developerCountActive
                    project_count: projectCountActive
                    contact_count: citizenCountActive
                }
            `
        }).valueChanges.pipe(
            map((result: any) => result.data),
            tap((response: any) => {
                this._data_real.next(response);
            })
        );
    }
}
