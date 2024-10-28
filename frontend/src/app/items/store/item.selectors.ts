import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ItemState } from './item.reducer';

export const selectItemState = createFeatureSelector<ItemState>('items');

export const selectItems = createSelector(
    selectItemState,
    (state: ItemState) => state.items
);

export const selectItemsError = createSelector(
    selectItemState,
    (state: ItemState) => state.error
);

export const selectItemsLoading = createSelector(
    selectItemState,
    (state: ItemState) => state.loading
);
