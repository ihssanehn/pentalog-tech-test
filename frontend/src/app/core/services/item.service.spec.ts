import { TestBed } from '@angular/core/testing';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { ItemService } from './item.service';
import { Item } from '../models/item.model';
import { getApiBaseUrl } from '../helper';
import {provideHttpClient} from "@angular/common/http";

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;
  const apiUrl = `${getApiBaseUrl()}items`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [ItemService,
        provideHttpClient(),
        provideHttpClientTesting()]
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getItems', () => {
    it('should return an array of items', () => {
      const mockItems: Item[] = [
        { name: 'Item 1' },
        { name: 'Item 2' }
      ];

      service.getItems().subscribe(items => {
        expect(items).toEqual(mockItems);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockItems);
    });

    it('should return empty array when response is null', () => {
      service.getItems().subscribe(items => {
        expect(items).toEqual([]);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(null);
    });

    it('should handle network error (status 0)', (done) => {
      service.getItems().subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (errorMessage) => {
          expect(errorMessage).toBe('Unable to connect to the server. Please check your connection.');
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(null, { status: 0, statusText: 'Network Error' });
    });

    it('should handle server-side error', (done) => {
      service.getItems().subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (errorMessage) => {
          expect(errorMessage).toContain('Internal server error. Please try again later.');
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(null, { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('addItem', () => {
    it('should add an item successfully', () => {
      const mockItem: Item = { name: 'New Item' };

      service.addItem(mockItem).subscribe(item => {
        expect(item).toEqual(mockItem);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockItem);
      req.flush(mockItem);
    });

    it('should handle error when adding item', (done) => {
      const mockItem: Item = { name: 'New Item' };

      service.addItem(mockItem).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (errorMessage) => {
          expect(errorMessage).toContain('Bad request')
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('error'), {
        status: 400,
        statusText: 'Bad request'
      });
    });

    it('should handle Unauthorized error', (done) => {
      const mockItem: Item = { name: 'New Item' };

      service.addItem(mockItem).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (errorMessage) => {
          expect(errorMessage).toContain('Unauthorized')
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('error'), {
        status: 401,
        statusText: 'Unauthorized'
      });
    });
    it('should handle Unknown Server error', (done) => {
      const mockItem: Item = { name: 'New Item' };

      service.addItem(mockItem).subscribe({
        next: () => done.fail('Should have failed with error'),
        error: (errorMessage) => {
          expect(errorMessage).toContain('Server error')
          done();
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.error(new ProgressEvent('error'), {
        status: 503,
        statusText: 'Unknown Error'
      });
    });
  });
});
