import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { HackerRankService } from './hacker-rank.service';
import { HackerRankItem } from '../models/hacker-rank-item.model';
import { environment } from '../../environments/environment';

describe('HackerRankService', () => {
  let service: HackerRankService;
  let httpTestingController: HttpTestingController;
  const mockData: HackerRankItem[] = [
    { id: 1, title: 'Angular Rocks', author: 'Alice', url: 'https://...' },
    { id: 2, title: 'Testing Tips', author: 'Bob', url: 'https://...' },
  ];

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

  it('should call the correct URL for getNewWithUrl()', () => {
    service.getNewWithUrl().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNewWithUrl`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('should handle HTTP errors for getNewWithUrl()', () => {
    const error: string = 'HTTP error';

    service.getNewWithUrl().subscribe({
      next: () => fail('Expected: error. Received: response'),
      error: (error) => {
        expect(error.status).toBe(500);
        expect(error.statusText).toBe('Internal server error');
      },
    });

    const testRequest = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNewWithUrl`
    );
    expect(testRequest.request.method).toBe('GET');

    // Simulate a server error
    testRequest.flush(error, {
      status: 500,
      statusText: 'Internal server error',
    });
  });

  it('should handle empty response for getNewWithUrl()', () => {
    service.getNewWithUrl().subscribe((data) => {
      expect(data).toEqual([]);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNewWithUrl`
    );
    expect(req.request.method).toBe('GET');

    // Simulate an empty response
    req.flush([]);
  });
});
