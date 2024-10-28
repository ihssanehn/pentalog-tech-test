import { createAction, props } from '@ngrx/store';
import {Item} from "../../core/models/item.model";

// Loading actions
export const setLoading = createAction('[Item] Set Loading');
export const clearLoading = createAction('[Item] Clear Loading');

// Load items actions
export const loadItems = createAction('[Item] Load Items');
export const loadItemsSuccess = createAction(
    '[Item] Load Items Success',
    props<{ items: Item[] }>()
);
export const loadItemsFailure = createAction(
    '[Item] Load Items Failure',
    props<{ error: string }>()
);

// Add item actions
export const addItem = createAction(
    '[Item] Add Item',
    props<{ item: Item }>()
);
export const addItemSuccess = createAction(
    '[Item] Add Item Success',
    props<{ item: Item }>()
);
export const addItemFailure = createAction(
    '[Item] Add Item Failure',
    props<{ error: string }>()
);
