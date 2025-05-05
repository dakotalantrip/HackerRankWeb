import { TestBed } from '@angular/core/testing';

import { HackerRankService } from './hacker-rank.service';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { HackerRankItem } from '../models/hacker-rank-item.model';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

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

  it('should call the correct URL for getNew()', () => {
    const mockResponse: HackerRankItem[] = [
      {
        id: 1,
        title: 'Item 1',
        author: 'Author 1',
        url: 'https://example.com',
      },
      {
        id: 2,
        title: 'Item 2',
        author: 'Author 2',
        url: 'https://example.com',
      },
    ];

    service.getNew().subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpTestingController.expectOne(
      `${environment.apiUrl}HackerRank/GetNew`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
