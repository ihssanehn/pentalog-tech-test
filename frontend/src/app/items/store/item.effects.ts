import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, concatMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
    loadItems,
    loadItemsSuccess,
    loadItemsFailure,
    addItem,
    addItemSuccess,
    addItemFailure,
    setLoading,
    clearLoading
} from './item.actions';
import { ItemService } from '../../core/services/item.service';
import { Store } from "@ngrx/store";
import { Item } from '../../core/models/item.model';
import {HttpErrorResponse} from "@angular/common/http";

@Injectable()
export class ItemEffects {
    constructor(
        private readonly actions$: Actions,
        private readonly itemService: ItemService,
        private readonly store: Store
    ) {}

    /**
     * Effect to handle loading items with retry logic
     */
    loadItems$ = createEffect(() =>
        this.actions$.pipe(
            ofType(loadItems),
            switchMap(() => this.handleDataOperation(
                this.itemService.getItems(),
                (items: Item[]) => loadItemsSuccess({ items: items || [] }), // Ensure items is never null
                (error: string) => loadItemsFailure({ error })
            ))
        )
    );

    /**
     * Effect to handle adding new items
     */
    addItem$ = createEffect(() =>
        this.actions$.pipe(
            ofType(addItem),
            switchMap(({ item }) => this.handleDataOperation(
                this.itemService.addItem(item),
                (newItem: Item) => addItemSuccess({ item: newItem }),
                (error: string) => addItemFailure({ error })
            ))
        )
    );

    private handleDataOperation<T>(
        operation$: Observable<T>,
        successAction: (data: T) => Action,
        failureAction: (error: string) => Action
    ): Observable<Action> {
        this.store.dispatch(setLoading());

        return operation$.pipe(
            map(data => [
                successAction(data),
                clearLoading()
            ]),
            catchError((error: string) => {
                console.error('Operation failed:', error);
                return of([
                    failureAction(error || 'An unexpected error occurred'),
                    clearLoading()
                ]);
            }),
            concatMap(actions => actions)
        );
    }
}
