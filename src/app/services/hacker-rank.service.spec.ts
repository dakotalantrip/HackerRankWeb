import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { HackerRankService } from './hacker-rank.service';
import { environment } from '../../environments/environment';
import { mockHackerRankItemList } from '../testing/test-data';

describe('HackerRankService', () => {
  let service: HackerRankService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HackerRankService,
      ],
    });

    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(HackerRankService);
  });

  afterEach(() => {
    // Ensure no outstanding HTTP requests remain
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  //#region GetNew

  it('should call the correct URL for getNew()', () => {
    service.getNew().subscribe((data) => {
      expect(data).toEqual(mockHackerRankItemList);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNew`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockHackerRankItemList);
  });

  it('should handle HTTP errors for getNew()', () => {
    const error: string = 'HTTP error';

    service.getNew().subscribe({
      next: () => fail('Expected: error. Received: response'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal server error');
      },
    });

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNew`
    );
    expect(testRequest.request.method).toBe('GET');

    // Simulate a server error
    testRequest.flush(error, {
      status: 500,
      statusText: 'Internal server error',
    });
  });

  it('should handle empty response for getNew()', () => {
    service.getNew().subscribe((data) => {
      expect(data).toEqual([]);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNew`
    );
    expect(req.request.method).toBe('GET');

    // Simulate an empty response
    req.flush([]);
  });

  //#endregion

  //#region GetNewPaginated

  it('should handle HTTP errors for getNewPaginated()', () => {
    const searchTerm = 'angular';
    const errorMessage = 'Failed to fetch data';

    service.getNewPaginated(searchTerm).subscribe({
      next: () => fail('Expected an error, but got a response'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal Server Error');
      },
    });

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNewPaginated?searchTerm=${searchTerm}&page=1&pageSize=25`
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

    service.getNewPaginated(searchTerm).subscribe((items) => {
      expect(items).toEqual({ items: [], totalItems: 0, totalPages: 0 });
    });

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNewPaginated?searchTerm=${searchTerm}&page=1&pageSize=25`
    );
    expect(testRequest.request.method).toBe('GET');

    // Simulate an empty response
    testRequest.flush({ items: [], totalItems: 0, totalPages: 0 });
  });

  it('should include pagination parameters in the request', () => {
    const searchTerm = 'angular';
    const page = 2;
    const pageSize = 50;

    service.getNewPaginated(searchTerm, page, pageSize).subscribe();

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNewPaginated?searchTerm=${searchTerm}&page=${page}&pageSize=${pageSize}`
    );
    expect(testRequest.request.method).toBe('GET');
    testRequest.flush(mockHackerRankItemList);
  });

  it('should include query parameters in the request from getNewPaginated()', () => {
    const searchTerm = 'angular';

    service.getNewPaginated(searchTerm).subscribe();

    const testRequest = httpTestingController.expectOne(
      (request) =>
        request.url === `${environment.apiUrl}HackerRank/GetNewPaginated` &&
        request.params.get('searchTerm') === searchTerm &&
        request.params.get('page') === '1' &&
        request.params.get('pageSize') === '25'
    );

    expect(testRequest).toBeTruthy();
    testRequest.flush(mockHackerRankItemList);
  });

  //#endregion
});
