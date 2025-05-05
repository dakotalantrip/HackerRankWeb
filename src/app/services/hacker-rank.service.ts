import { Injectable } from '@angular/core';
import { APIBaseService } from './api-base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
    return this.get<HackerRankItem[]>('GetNewWithUrl');
  }
}
