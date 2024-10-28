import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ItemsRoutingModule } from './items-routing.module';
import {ItemsComponent} from './items.component';
import {StoreModule} from '@ngrx/store';
import {itemReducer} from './store/item.reducer';
import {ItemEffects} from './store/item.effects';
import {EffectsModule} from '@ngrx/effects';
import {MatCard, MatCardContent} from '@angular/material/card';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";

@NgModule({
  declarations: [
    ItemsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    ItemsRoutingModule,
    StoreModule.forFeature('items', itemReducer),
    EffectsModule.forFeature([ItemEffects]),
    MatCardContent,
    MatCard,
    MatProgressSpinnerModule
  ],
  providers: []
})
export class ItemsModule {}
