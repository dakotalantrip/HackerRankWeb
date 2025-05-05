import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { SearchService } from './search.service';
import { HackerRankItem } from '../models/hacker-rank-item.model';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../models/paginated-result.model';

describe('SearchService', () => {
  let service: SearchService;
  let httpTestingController: HttpTestingController;
  const mockData: PaginatedResult<HackerRankItem> = {
    items: [
      { id: 1, title: 'Angular Rocks', author: 'Alice', url: 'https://...' },
      { id: 2, title: 'Testing Tips', author: 'Bob', url: 'https://...' },
    ],
    totalItems: 2,
    totalPages: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        SearchService,
      ],
    });

    service = TestBed.inject(SearchService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct URL for search()', () => {
    const searchTerm = 'angular';

    service.search(searchTerm).subscribe((items) => {
      expect(items).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/Search?searchTerm=${searchTerm}&page=1&pageSize=25`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle HTTP errors for search()', () => {
    const searchTerm = 'angular';
    const errorMessage = 'Failed to fetch data';

    service.search(searchTerm).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/Search?searchTerm=${searchTerm}&page=1&pageSize=25`
    );
    expect(testRequest.request.method).toBe('GET');

    // Simulate a server error
    testRequest.flush(errorMessage, {
      status: 500,
      statusText: 'Internal Server Error',
    });
  });

  it('should handle an empty response for search()', () => {
    const searchTerm = 'angular';

    service.search(searchTerm).subscribe((items) => {
      expect(items).toEqual({ items: [], totalItems: 0, totalPages: 0 });
    });

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/Search?searchTerm=${searchTerm}&page=1&pageSize=25`
    );
    expect(testRequest.request.method).toBe('GET');

    // Simulate an empty response
    testRequest.flush({ items: [], totalItems: 0, totalPages: 0 });
  });

  it('should include pagination parameters in the request', () => {
    const searchTerm = 'angular';
    const page = 2;
    const pageSize = 50;

    service.search(searchTerm, page, pageSize).subscribe((items) => {
      expect(items).toEqual(mockData);
    });

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/Search?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`
    );
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(mockData);
  });

  it('should include query parameters in the request', () => {
    const searchTerm = 'angular';

    service.search(searchTerm).subscribe();

    const testRequest = httpTestingController.expectOne(
      (request) =>
        request.url === `${environment.apiUrl}HackerRank/Search` &&
        request.params.get('searchTerm') === searchTerm &&
        request.params.get('page') === '1' &&
        request.params.get('pageSize') === '25'
    );

    expect(testRequest).toBeTruthy();
    testRequest.flush(mockData);
  });
});
