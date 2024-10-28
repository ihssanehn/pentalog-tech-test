import { createReducer, on } from '@ngrx/store';
import { setLoading, clearLoading, loadItemsSuccess, loadItemsFailure, addItemSuccess, addItemFailure } from './item.actions';
import {Item} from "../../core/models/item.model";

export interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
}

export const initialState: ItemState = {
  items: [],
  loading: false,
  error: null
};

export const itemReducer = createReducer(
    initialState,
    on(setLoading, (state) => ({ ...state, loading: true })),
    on(clearLoading, (state) => ({ ...state, loading: false })),
    on(loadItemsSuccess, (state, { items }) => ({ ...state, items, error: null })),
    on(loadItemsFailure, (state, { error }) => ({ ...state, error })),
    on(addItemSuccess, (state, { item }) => ({ ...state, items: [...state.items, item], error: null })),
    on(addItemFailure, (state, { error }) => ({ ...state, error }))
);
