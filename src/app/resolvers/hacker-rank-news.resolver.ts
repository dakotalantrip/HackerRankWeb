import { Resolve } from '@angular/router';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';

import { HackerRankItem } from '../models/hacker-rank-item.model';
import { HackerRankService } from '../services/hacker-rank.service';

@Injectable({ providedIn: 'root' })
export class HackerRankNewsResolver implements Resolve<HackerRankItem[]> {
  constructor(private hackerRankService: HackerRankService) {}

  resolve(): Observable<HackerRankItem[]> {
    return this.hackerRankService.getNew().pipe(
      catchError(() => {
        return of([]);
      })
    );
  }
}
