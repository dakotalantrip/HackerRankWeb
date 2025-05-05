import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { APIBaseService } from './api-base.service';
import { HackerRankItem } from '../models/hacker-rank-item.model';

@Injectable({
  providedIn: 'root',
})
export class HackerRankService extends APIBaseService {
  constructor(httpClient: HttpClient) {
    super(httpClient, 'HackerRank');
  }

  public getNewWithUrl(): Observable<HackerRankItem[]> {
    return this.get<HackerRankItem[]>('GetNewWithUrl');
  }
}
