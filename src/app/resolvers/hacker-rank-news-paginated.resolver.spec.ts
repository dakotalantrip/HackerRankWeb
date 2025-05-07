import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HackerRankItem } from '../models/hacker-rank-item.model';
import { HackerRankNewsPaginatedResolver } from './hacker-rank-news-paginated.resolver';
import { HackerRankService } from '../services/hacker-rank.service';
import { PaginatedResult } from '../models/paginated-result.model';

describe('HackerRankNewsPaginatedResolver', () => {
  let resolver: HackerRankNewsPaginatedResolver;
  let hackerRankService: jasmine.SpyObj<HackerRankService>;
  const mockData: PaginatedResult<HackerRankItem> = {
    items: [
      { id: 1, title: 'Angular Rocks', author: 'Alice', url: 'https://...' },
      { id: 2, title: 'Testing Tips', author: 'Bob', url: 'https://...' },
    ],
    totalItems: 2,
    totalPages: 1,
  };

  beforeEach(() => {
    const hackerRankServiceSpy = jasmine.createSpyObj('HackerRankService', [
      'getNewPaginated',
    ]);

    TestBed.configureTestingModule({
      providers: [
        HackerRankNewsPaginatedResolver,
        { provide: HackerRankService, useValue: hackerRankServiceSpy },
      ],
    });

    resolver = TestBed.inject(HackerRankNewsPaginatedResolver);
    hackerRankService = TestBed.inject(
      HackerRankService
    ) as jasmine.SpyObj<HackerRankService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should call getNewPaginated() and return data when successful', (done) => {
    hackerRankService.getNewPaginated.and.returnValue(of(mockData));

    resolver.resolve().subscribe((result) => {
      expect(result).toEqual(mockData);
      expect(hackerRankService.getNewPaginated).toHaveBeenCalled();
      done();
    });
  });

  it('should return a PaginatedResult object with no items when getNewPaginated() throws an error', (done) => {
    hackerRankService.getNewPaginated.and.returnValue(
      throwError(() => new Error('Error'))
    );

    resolver.resolve().subscribe({
      next: (result) => {
        expect(result).toEqual({ items: [], totalItems: 0, totalPages: 0 });
      },
      complete: () => {
        expect(hackerRankService.getNewPaginated).toHaveBeenCalled();
        done(); // Ensure the test completes
      },
    });
  });
});
