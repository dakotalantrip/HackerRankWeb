import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APIBaseService } from './api-base.service';
import { HackerRankItem } from '../models/hacker-rank-item.model';
import { PaginatedResult } from '../models/paginated-result.model';

@Injectable({
  providedIn: 'root',
})
export class HackerRankService extends APIBaseService {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'HackerRank');
  }

  public getNew(): Observable<HackerRankItem[]> {
    return this.get<HackerRankItem[]>('GetNew');
  }

  public getNewPaginated(
    searchTerm: string = '',
    page: number = 1,
    pageSize: number = 25
  ): Observable<PaginatedResult<HackerRankItem>> {
    const params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    return this.getWithParams<PaginatedResult<HackerRankItem>>(`GetNewPaginated`, params);
  }
}
