import { ActivatedRouteSnapshot, Resolve, ResolveFn } from '@angular/router';
import { HackerRankService } from '../services/hacker-rank.service';
import { HackerRankItem } from '../models/hacker-rank-item.model';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class HackerRankNewsResolver implements Resolve<HackerRankItem[]> {
  constructor(private hackerRankService: HackerRankService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<HackerRankItem[]> {
    return this.hackerRankService.getNew().pipe(
      catchError(() => {
        return EMPTY;
      })
    );
  }
}
