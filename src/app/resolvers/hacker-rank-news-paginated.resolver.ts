import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { HackerRankService } from '../services/hacker-rank.service';
import { HackerRankItem } from '../models/hacker-rank-item.model';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';
import { PaginatedResult } from '../models/paginated-result.model';
import { SearchService } from '../services/search.service';

@Injectable({ providedIn: 'root' })
export class HackerRankNewsPaginatedResolver
  implements Resolve<PaginatedResult<HackerRankItem>>
{
  constructor(private searchService: SearchService) {}

  resolve(
    route: ActivatedRouteSnapshot
  ): Observable<PaginatedResult<HackerRankItem>> {
    return this.searchService.search('').pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }
}
