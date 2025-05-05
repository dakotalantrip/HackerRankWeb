import { TestBed } from '@angular/core/testing';

import { SearchService } from './search.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HackerRankItem } from '../models/hacker-rank-item.model';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResult } from '../models/paginated-result.model';

describe('SearchService', () => {
  let service: SearchService;
  let httpTestingController: HttpTestingController;

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
    // Verify that no unmatched requests are outstanding.
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call the correct URL for search()', () => {
    const searchTerm = 'angular';
    const mockItems: PaginatedResult<HackerRankItem> = {
      items: [
        { id: 1, title: 'Angular Rocks', author: 'Alice', url: 'https://...' },
        { id: 2, title: 'Testing Tips', author: 'Bob', url: 'https://...' },
      ],
      totalItems: 2,
      totalPages: 1,
    };

    service.search(searchTerm).subscribe((items) => {
      expect(items).toEqual(mockItems);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/Search/${searchTerm}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });
});
