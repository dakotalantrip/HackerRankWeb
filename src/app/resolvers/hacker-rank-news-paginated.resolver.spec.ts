import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HackerRankItem } from '../models/hacker-rank-item.model';
import { HackerRankNewsPaginatedResolver } from './hacker-rank-news-paginated.resolver';
import { PaginatedResult } from '../models/paginated-result.model';
import { SearchService } from '../services/search.service';

describe('HackerRankNewsPaginatedResolver', () => {
  let resolver: HackerRankNewsPaginatedResolver;
  let searchService: jasmine.SpyObj<SearchService>;
  const mockData: PaginatedResult<HackerRankItem> = {
    items: [
      { id: 1, title: 'Angular Rocks', author: 'Alice', url: 'https://...' },
      { id: 2, title: 'Testing Tips', author: 'Bob', url: 'https://...' },
    ],
    totalItems: 2,
    totalPages: 1,
  };

  beforeEach(() => {
    const searchServiceSpy = jasmine.createSpyObj('SearchService', ['search']);

    TestBed.configureTestingModule({
      providers: [
        HackerRankNewsPaginatedResolver,
        { provide: SearchService, useValue: searchServiceSpy },
      ],
    });

    resolver = TestBed.inject(HackerRankNewsPaginatedResolver);
    searchService = TestBed.inject(
      SearchService
    ) as jasmine.SpyObj<SearchService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should call search() and return data when successful', (done) => {
    searchService.search.and.returnValue(of(mockData));

    resolver.resolve().subscribe((result) => {
      expect(result).toEqual(mockData);
      expect(searchService.search).toHaveBeenCalled();
      done();
    });
  });

  it('should return EMPTY when search throws an error', (done) => {
    searchService.search.and.returnValue(throwError(() => new Error('Error')));

    resolver.resolve().subscribe({
      next: (result) => {
        expect(result).toEqual({ items: [], totalItems: 0, totalPages: 0 });
      },
      complete: () => {
        expect(searchService.search).toHaveBeenCalled();
        done(); // Ensure the test completes
      },
    });
  });
});
