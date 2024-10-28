import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {Item} from '../models/item.model';
import {getApiBaseUrl} from '../helper';
import {catchError, map} from "rxjs/operators";
@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private itemsApiUrl = `${getApiBaseUrl()}items`;

  constructor(private http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(this.itemsApiUrl).pipe(
        map(items => items || []),
        catchError(this.handleError)
    );
  }

  addItem(item: Item): Observable<Item> {
    return this.http.post<Item>(this.itemsApiUrl, item).pipe(
        catchError(this.handleError)
    );
  }

  private handleError(error : HttpErrorResponse): Observable<never> {
    let errorMessage = 'An error occurred';

    switch (error.status) {
      case 0:
        errorMessage = 'Unable to connect to the server. Please check your connection.';
        break;
      case 400:
        errorMessage = `Bad request: ${error.error?.message || error.message}`;
        break;
      case 401:
        errorMessage = 'Unauthorized. Please log in again.';
        break;
      case 500:
        errorMessage = 'Internal server error. Please try again later.';
        break;
      default:
        errorMessage = `Server error (${error.status}): ${error.error?.message || error.message}`;
    }
    return throwError(errorMessage);
  }
}
