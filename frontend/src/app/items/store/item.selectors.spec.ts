import { selectItems, selectItemsError, selectItemsLoading, selectItemState } from './item.selectors';
import { ItemState } from './item.reducer';

describe('Item Selectors', () => {
    const initialState: ItemState = {
        items: [{ name: 'Item 1' }, { name: 'Item 2' }],
        loading: false,
        error: null,
    };

    it('should select the items state', () => {
        const result = selectItemState.projector(initialState);
        expect(result).toEqual(initialState);
    });

    it('should select items', () => {
        const result = selectItems.projector(initialState);
        expect(result).toEqual(initialState.items);
    });

    it('should select error', () => {
        const errorState = { ...initialState, error: 'Error loading items' };
        const result = selectItemsError.projector(errorState);
        expect(result).toEqual('Error loading items');
    });

    it('should select loading', () => {
        const loadingState = { ...initialState, loading: true };
        const result = selectItemsLoading.projector(loadingState);
        expect(result).toEqual(true);
    });
});
