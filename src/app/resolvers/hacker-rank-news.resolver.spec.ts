import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { HackerRankItem } from '../models/hacker-rank-item.model';
import { HackerRankNewsResolver } from './hacker-rank-news.resolver';
import { HackerRankService } from '../services/hacker-rank.service';

describe('HackerRankNewsResolver', () => {
  let resolver: HackerRankNewsResolver;
  let hackerRankService: jasmine.SpyObj<HackerRankService>;

  const mockData: HackerRankItem[] = [
    { id: 1, title: 'Angular Rocks', author: 'Alice', url: 'https://...' },
    { id: 2, title: 'Testing Tips', author: 'Bob', url: 'https://...' },
  ];

  beforeEach(() => {
    const hackerRankServiceSpy = jasmine.createSpyObj('HackerRankService', [
      'getNew',
    ]);

    TestBed.configureTestingModule({
      providers: [
        HackerRankNewsResolver,
        { provide: HackerRankService, useValue: hackerRankServiceSpy },
      ],
    });

    resolver = TestBed.inject(HackerRankNewsResolver);
    hackerRankService = TestBed.inject(
      HackerRankService
    ) as jasmine.SpyObj<HackerRankService>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should call getNew() and return data when successful', (done) => {
    hackerRankService.getNew.and.returnValue(of(mockData));

    resolver.resolve().subscribe((result) => {
      expect(result).toEqual(mockData);
      expect(hackerRankService.getNew).toHaveBeenCalled();
      done();
    });
  });

  it('should return an empty array when getNew() throws an error', (done) => {
    hackerRankService.getNew.and.returnValue(
      throwError(() => new Error('Error'))
    );

    resolver.resolve().subscribe({
      next: (result) => {
        expect(result).toEqual([]);
      },
      complete: () => {
        expect(hackerRankService.getNew).toHaveBeenCalled();
        done();
      },
    });
  });
});
