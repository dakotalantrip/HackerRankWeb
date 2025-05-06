import { TestBed } from '@angular/core/testing';
import { HackerRankNewsResolver } from './hacker-rank-news.resolver';
import { HackerRankService } from '../services/hacker-rank.service';
import { of, throwError } from 'rxjs';
import { HackerRankItem } from '../models/hacker-rank-item.model';

describe('HackerRankNewsResolver', () => {
  let resolver: HackerRankNewsResolver;
  let hackerRankService: jasmine.SpyObj<HackerRankService>;

  const mockData: HackerRankItem[] = [
    { id: 1, title: 'Angular Rocks', author: 'Alice', url: 'https://...' },
    { id: 2, title: 'Testing Tips', author: 'Bob', url: 'https://...' },
  ];

  beforeEach(() => {
    const hackerRankServiceSpy = jasmine.createSpyObj('HackerRankService', [
      'getNewWithUrl',
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
    hackerRankService.get.and.returnValue(of(mockData));

    resolver.resolve().subscribe((result) => {
      expect(result).toEqual(mockData);
      expect(hackerRankService.get).toHaveBeenCalled();
      done();
    });
  });

  it('should return EMPTY when getNew() throws an error', (done) => {
    hackerRankService.get.and.returnValue(throwError(() => new Error('Error')));

    resolver.resolve().subscribe({
      next: (result) => {
        expect(result).toEqual([]);
      },
      complete: () => {
        expect(hackerRankService.get).toHaveBeenCalled();
        done(); // Ensure the test completes
      },
    });
  });
});
