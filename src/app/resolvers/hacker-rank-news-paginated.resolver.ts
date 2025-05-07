import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import { HackerRankItem } from '../models/hacker-rank-item.model';
import { HackerRankService } from '../services/hacker-rank.service';
import { PaginatedResult } from '../models/paginated-result.model';

@Injectable({ providedIn: 'root' })
export class HackerRankNewsPaginatedResolver implements Resolve<PaginatedResult<HackerRankItem>> {
  constructor(private hackerRankService: HackerRankService) {}

  resolve(): Observable<PaginatedResult<HackerRankItem>> {
    return this.hackerRankService.getNewPaginated().pipe(
      catchError(() => {
        return of({ items: [], totalItems: 0, totalPages: 0 });
      })
    );
  }
}
