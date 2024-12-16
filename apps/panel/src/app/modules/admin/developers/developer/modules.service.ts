import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemPagination, BaseItem } from './modules.types';
import { BehaviorSubject, filter, map, Observable, of, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GRAPHQL } from './modules.graphql';
import { ActivatedRouteSnapshot } from '@angular/router';
import { moduleConfig } from './module.config';

@Injectable({providedIn: 'root'})
export class ModulesService
{
    // Private
    private _pagination: BehaviorSubject<ItemPagination | null> = new BehaviorSubject(null);
    private _item: BehaviorSubject<BaseItem | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<BaseItem[] | null> = new BehaviorSubject(null);
    public _drawer: Subject<boolean> = new Subject();
    public _pathParameter: Subject<boolean> = new Subject();
    public _counts: BehaviorSubject<any | null> = new BehaviorSubject(null);
    public _filter: Subject<boolean> = new Subject();
    public _selects: BehaviorSubject<any | null> = new BehaviorSubject(null);

    private _graphql = GRAPHQL;

    settingType: string = moduleConfig.type2

    pathParameter: string = '';
    searchInput: string = '';

    page: number = 0
    size: number = 50
    sort: string = 'createdAt'
    order: 'asc' | 'desc' | '' = 'desc'
    filter: string = ''

   
    constructor(private _httpClient: HttpClient, private apollo: Apollo)
    {

    }
    get pagination$(): Observable<ItemPagination>
    {
        return this._pagination.asObservable();
    }
    get item$(): Observable<BaseItem>
    {
        return this._item.asObservable();
    }
    get items$(): Observable<BaseItem[]>
    {
        return this._items.asObservable();
    }

    setPathType(type: string): void
    {
        if(this.pathParameter === type) return;
        this.pathParameter  = type;
        this.page = 0;
        this._pathParameter.next(true);
    }
    setFiter(filter: string): void
    {
        if(this.filter === filter) return;
        this.filter  = filter;
        this.page = 0;
        this._filter.next(true);
        this.getitems().subscribe();
        
    }
   
    getitems( 
        page: number = this.page,
        size: number = this.size,
        sort: string = this.sort,
        order: 'asc' | 'desc' | '' = this.order,
        search: string = this.searchInput,
        filter: string = this.filter,
        ):
        Observable<{ pagination: ItemPagination; items: BaseItem[] }>
    {
        this.searchInput = search;
        this.page = page;
        this.size = size;
        this.sort = sort;
        this.order = order;
        this.filter = filter;

        return this.apollo
        .watchQuery<any>({
          query: this._graphql.getPagination,
          variables: {
            page,
            size,
            sort,
            order,
            search,
            filter,
            status: this.pathParameter,
            type: this.settingType
          },
        })
        .valueChanges.pipe(
          map(({ data, loading }) => {
            this._pagination.next(data.itemPegination.pagination);
            this._items.next(data.itemPegination.items);
            this._counts.next(data.itemCount);
            return data;
          })
        );
    }
    getSelects(): Observable<any> {
        return this.apollo
          .watchQuery<any>({
            query: this._graphql.getSelects,
          })
          .valueChanges.pipe(
            map(({ data, loading }) => {
              this._selects.next({ phonetypes: data.phonetypes, socialmediaplatforms: data.socialmediaplatforms });
              return data;
            }),
          );
      }
   
    getitemById(id: string): Observable<BaseItem>
    {
        return this._items.pipe(
            take(1),
            map((items) =>
            {
                const item = items.find(item => item.id === id) || null;
                this._item.next(item);
                return item;
            }),
            switchMap((item) =>
            {
                if ( !item )
                {
                    return throwError('Could not found item with id of ' + id + '!');
                }

                return of(item);
            }),
        );
    }

    getItemDetailsById(id: string): Observable<BaseItem>
    {
        return this.apollo.query<any>({
            query: this._graphql.getItemDetailsById,
            variables: { id }
        }).pipe(map(({ data }) => {

            this._item.next(data.item);
            return data.item;
        }));
    }

    createitem(): Observable<BaseItem>
    {
        return this.items$.pipe(
            take(1),
            switchMap((items) =>
            this.apollo.mutate<any>({
              mutation: this._graphql.createItem,
            }).pipe(
                map((data: any) => {
                  this._items.next([data.data.newItem, ...items]);
                  this._item.next(data.data.newItem);
                  return data.data.newItem;
                })
              )
            )
          );
    }

   
    updateitem(id: string, updateItem: BaseItem, changeAvatar: boolean): Observable<BaseItem>
    {
            updateItem.type = this.settingType
            return this.items$.pipe(
            take(1),
            switchMap((items: any) =>
            this.apollo.mutate<any>({
                mutation: this._graphql.updateItem,
                variables: {
                    item: updateItem,
                    changeAvatar: changeAvatar
                }
                })
                .pipe(
                    map((updatedItem: any) => {
                        /*
                    const index = items.findIndex((item) => item.id === id);  
                    const arrayForSort = [...items]                  
                    arrayForSort[index] = updatedItem.data.updateItem;
                    this._items.next(arrayForSort);
                    this._item.next(updatedItem.data.updateItem);
                    */
                    return updatedItem.data.updateItem;
                    }),
                    switchMap((updatedItem) =>
                    this.item$.pipe(
                        take(1),
                        filter((item) => item && item.id === id),
                        tap(() => {
                        this._item.next(updatedItem);
                        return updatedItem;
                        })
                    )
                    )
                )
            )
            );
    }

    updateList(updatedItem: any): Observable<boolean>
    {
        return this.items$.pipe(
            take(1),
            map((items) =>{
                const index = items.findIndex((item) => item.id === updatedItem.id);  

                if (index === -1)
                {
                    this._items.next([updatedItem, ...items]);
                } else {
                    const arrayForSort = [...items]                  
                    arrayForSort[index] = updatedItem;
                    this._items.next(arrayForSort);
                }

                this._item.next(updatedItem);
                return true;
            })
        );
    }

      
    

    updateitemMulti(updateItem: BaseItem): Observable<any>
    {
            return  this.apollo.mutate<any>({
                mutation: this._graphql.updateItemMulti,
                variables: {
                    item: updateItem,
                }
                })
                .pipe(
                    map(({ data, loading }) => {
                        return data;
                    }
                )
            )
            
            
    }

    createitemsMulti(updateItem: BaseItem[]): Observable<any>
    {
            return  this.apollo.mutate<any>({
                mutation: this._graphql.createItemsMulti,
                variables: {
                    item: {data: updateItem},
                }
                })
                .pipe(
                    map(({ data, loading }) => {
                        return data;
                    }
                )
            )
            
            
    }
    deleteitem(id: string): Observable<boolean>
    {
        return this.items$.pipe(
            take(1),
            map((items) =>{
                const index = items.findIndex(item => item.id === id);
                items.splice(index, 1);
                this._items.next(items);
                return true;
            })
        );
    }

    
}
