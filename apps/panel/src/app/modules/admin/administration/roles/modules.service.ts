import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ItemPagination, BaseItem, SubItem } from './modules.types';
import { BehaviorSubject, filter, map, Observable, of, Subject, switchMap, take, tap, throwError } from 'rxjs';
import { Apollo } from 'apollo-angular';
import { GRAPHQL } from './modules.graphql';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({providedIn: 'root'})
export class RolesService
{
    // Private
    private _pagination: BehaviorSubject<ItemPagination | null> = new BehaviorSubject(null);
    private _item: BehaviorSubject<BaseItem | null> = new BehaviorSubject(null);
    private _items: BehaviorSubject<BaseItem[] | null> = new BehaviorSubject(null);
    private _submodules: BehaviorSubject<SubItem[] | null> = new BehaviorSubject(null);
    private _submodule: BehaviorSubject<SubItem | null> = new BehaviorSubject(null);
    public _drawer: Subject<boolean> = new Subject();
    public _pathParameter: Subject<boolean> = new Subject();
    public _counts: BehaviorSubject<any | null> = new BehaviorSubject(null);
    public _filter: Subject<boolean> = new Subject();

    private _graphql = GRAPHQL;

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
    get submodules$(): Observable<SubItem[]> {
        return this._submodules.asObservable();
      }
    
      get submodule$(): Observable<SubItem> {
        return this._submodule.asObservable();
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
          },
        })
        .valueChanges.pipe(
          map(({ data, loading }) => {
            this._pagination.next(data.rolesPegination.pagination);
            this._items.next(data.rolesPegination.items);
            this._counts.next(data.rolesCount);
            return data;
          })
        );
    }
    getSubModules(query: string = ""): Observable<{ permissions: SubItem[] }> {
        return this.apollo
          .watchQuery<any>({
            query: this._graphql.getSubModules,
            variables: {
              search: query,
            },
          })
          .valueChanges.pipe(
            map(({ data, loading }) => {
              this._submodules.next(data.submodules);
              return data;
            })
          );
      }
      getSubModule(subModule: SubItem):void {
        this._submodule.next(subModule);
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
        return this.apollo
            .watchQuery<any>({
                query: this._graphql.getItem,
                variables: {
                id: id,
                
                },
            })
            .valueChanges.pipe(
                map(({ data, loading }) => {
                
                const paydasObj = data.role;
                this._item.next(paydasObj);
                return data;
                })
            );
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
                  this._items.next([data.data.newRoles, ...items]);
                  this._item.next(data.data.newRoles);
                  return data.data.newRoles;
                })
              )
            )
          );
    }

   
    updateitem(id: string, updateItem: BaseItem): Observable<BaseItem>
    {
            return this.items$.pipe(
            take(1),
            switchMap((items: any) =>
            this.apollo.mutate<any>({
                mutation: this._graphql.updateItem,
                variables: {
                    item: updateItem,
                }
                })
                .pipe(
                    map((updatedItem: any) => {
                    const index = items.findIndex((item) => item.id === id);  
                    const arrayForSort = [...items]                  
                    arrayForSort[index] = updatedItem.data.updateRole;
                    this._items.next(arrayForSort);
                    this._item.next(updatedItem.data.updateRole);
                    return updatedItem.data.updateRole;
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


    updateItemWithPerm(id: string, updateItem: BaseItem): Observable<BaseItem> {
        return this.items$.pipe(
          take(1),
          switchMap((items) =>
          this.apollo.mutate<any>({
              mutation: this._graphql.updateItem,
              variables: {
                item: updateItem,
              }
              })
              .pipe(
                map((updatedItem: any) => {
                  /*
                  const index = items.findIndex((item) => item.id === id);
                  items[index] = updatedItem.data.updateRole;
                  this._items.next(items);
                  */
                  this._item.next(updatedItem.data.updateRole);
                  return updatedItem.data.updateRole;
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
