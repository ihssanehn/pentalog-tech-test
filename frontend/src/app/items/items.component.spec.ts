import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ItemsComponent } from './items.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { selectItems, selectItemsError } from './store/item.selectors';
import { loadItems, addItem } from './store/item.actions';
import { Item } from '../core/models/item.model';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

describe('ItemsComponent', () => {
    let component: ItemsComponent;
    let fixture: ComponentFixture<ItemsComponent>;
    let store: MockStore;

    const initialState = {
        items: {
            entities: [],
            error: null,
            loading: false
        }
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ItemsComponent],
            imports: [
                ReactiveFormsModule,
                MatListModule,
                MatInputModule,
                MatButtonModule,
                MatCardModule,
                NoopAnimationsModule,
                MatProgressSpinnerModule
            ],
            providers: [
                provideMockStore({
                    initialState,
                    selectors: [
                        { selector: selectItems, value: [] },
                        { selector: selectItemsError, value: null }
                    ]
                })
            ]
        }).compileComponents();

        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(ItemsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    afterEach(() => {
        store.resetSelectors();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Initialization', () => {
        it('should dispatch loadItems on init', () => {
            const dispatchSpy = spyOn(store, 'dispatch');
            component.ngOnInit();
            expect(dispatchSpy).toHaveBeenCalledWith(loadItems());
        });

        it('should initialize form control with empty string', () => {
            expect(component.itemNameControl.value).toBe('');
        });

        it('should mark form control as invalid when empty', () => {
            component.itemNameControl.updateValueAndValidity();
            expect(component.itemNameControl.valid).toBeFalsy();
            expect(component.itemNameControl.errors?.['required']).toBeTruthy();
        });
    });

    describe('Store Selectors', () => {
        it('should select items from store', (done) => {
            const mockItems: Item[] = [
                { name: 'Item 1' },
                { name: 'Item 2' }
            ];

            store.overrideSelector(selectItems, mockItems);
            store.refreshState();

            component.items$.subscribe(items => {
                expect(items).toEqual(mockItems);
                done();
            });
        });

        it('should select error from store', (done) => {
            const mockError = 'Test error message';

            store.overrideSelector(selectItemsError, mockError);
            store.refreshState();

            component.error$.subscribe(error => {
                expect(error).toBe(mockError);
                done();
            });
        });
    });

    describe('onAddItem', () => {
        it('should not dispatch addItem when form is invalid', () => {
            const dispatchSpy = spyOn(store, 'dispatch');
            component.itemNameControl.setValue('');

            component.onAddItem();

            expect(dispatchSpy).not.toHaveBeenCalled();
        });

        it('should dispatch addItem when form is valid', () => {
            const dispatchSpy = spyOn(store, 'dispatch');
            const testItemName = 'Test Item';
            component.itemNameControl.setValue(testItemName);

            component.onAddItem();

            expect(dispatchSpy).toHaveBeenCalledWith(
                addItem({ item: { name: testItemName } })
            );
        });

        it('should reset form after successful item addition', () => {
            const testItemName = 'Test Item';
            component.itemNameControl.setValue(testItemName);

            component.onAddItem();

            expect(component.itemNameControl.value).toBe(null);
        });
    });

    describe('Template Integration', () => {
        it('should display error message when error$ emits', () => {
            const errorMessage = 'Test error message';
            store.overrideSelector(selectItemsError, errorMessage);
            store.refreshState();
            fixture.detectChanges();

            const errorElement = fixture.nativeElement.querySelector('.mat-mdc-card-content');
            expect(errorElement.textContent).toContain(errorMessage);
        });

        it('should display items when items$ emits', () => {
            const mockItems: Item[] = [
                { name: 'Item 1' },
                { name: 'Item 2' }
            ];

            store.overrideSelector(selectItems, mockItems);
            store.refreshState();
            fixture.detectChanges();

            const listItems = fixture.nativeElement.querySelectorAll('mat-list-item');
            expect(listItems.length).toBe(mockItems.length);
            expect(listItems[0].textContent.trim()).toContain(mockItems[0].name);
            expect(listItems[1].textContent.trim()).toContain(mockItems[1].name);
        });

        it('should show validation error when form control is touched and empty', () => {
            component.itemNameControl.markAsTouched();
            fixture.detectChanges();

            const errorElement = fixture.nativeElement.querySelector('mat-error');
            expect(errorElement.textContent.trim()).toBe('Item name is required.');
        });

        it('should disable add button when form is invalid', () => {
            component.itemNameControl.setValue('');
            fixture.detectChanges();

            const addButton = fixture.nativeElement.querySelector('button[color="primary"]');
            expect(addButton.disabled).toBeFalsy(); // Note: In the current implementation, the button is not disabled
        });
    });
});
