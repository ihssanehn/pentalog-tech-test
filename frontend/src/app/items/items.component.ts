import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectItems, selectItemsError, selectItemsLoading } from './store/item.selectors';
import { Item } from "../core/models/item.model";
import { addItem, loadItems } from "./store/item.actions";
import { FormControl, Validators } from "@angular/forms";
import { Meta, Title } from "@angular/platform-browser";

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss']
})
export class ItemsComponent implements OnInit {

  items$: Observable<Item[]>;
  error$: Observable<string | null>;
  loading$: Observable<boolean>;
  itemNameControl: FormControl;

  constructor(private store: Store, private meta: Meta, private title: Title) {
    this.items$ = this.store.select(selectItems);
    this.error$ = this.store.select(selectItemsError);
    this.loading$ = this.store.select(selectItemsLoading);
    this.itemNameControl = new FormControl('', [Validators.required]);

    // META tags
    this.title.setTitle('Items Component');
    this.meta.updateTag({ name: 'description', content: 'Add and get list of items' });
  }

  ngOnInit(): void {
    this.store.dispatch(loadItems());
  }

  onAddItem(): void {
    if (this.itemNameControl.valid) {
      const newItem: Item = { name: this.itemNameControl.value };
      this.store.dispatch(addItem({ item: newItem }));
      this.itemNameControl.reset();
    }
  }
}
