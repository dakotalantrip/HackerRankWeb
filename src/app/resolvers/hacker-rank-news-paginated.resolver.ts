import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, Observable } from 'rxjs';

import { HackerRankItem } from '../models/hacker-rank-item.model';
import { PaginatedResult } from '../models/paginated-result.model';
import { SearchService } from '../services/search.service';

@Injectable({ providedIn: 'root' })
export class HackerRankNewsPaginatedResolver
  implements Resolve<PaginatedResult<HackerRankItem>>
{
  constructor(private searchService: SearchService) {}

  resolve(): Observable<PaginatedResult<HackerRankItem>> {
    return this.searchService.search('').pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }
}
