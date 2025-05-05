import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { HackerRankItem } from '../../models/hacker-rank-item.model';
import { PaginatedResult } from '../../models/paginated-result.model';
import { SearchService } from '../../services/search.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-server-pagination',
  imports: [InfiniteScrollDirective, MatListModule, SearchBarComponent],
  templateUrl: './server-pagination.component.html',
  styleUrl: './server-pagination.component.scss',
})
export class ServerPaginationComponent implements OnInit, OnDestroy {
  public currentPage: number = 1;
  public hackerRankItems: HackerRankItem[] = [];
  public paginatedResultSignal = signal<PaginatedResult<HackerRankItem>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
  });
  public searchTerm: string = '';

  private searchTermSubject: Subject<string> = new Subject<string>();
  private subscription: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) {
    const routeData = this.route.snapshot.data[
      'hackerRankItems'
    ] as PaginatedResult<HackerRankItem>;

    this.paginatedResultSignal.set(routeData);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.searchTermSubject
        .pipe(
          debounceTime(500),
          distinctUntilChanged(),
          tap((value: string) => {
            this.searchTerm = value;
            this.hackerRankItems = [];
          }),
          switchMap((value: string) => this.search(value))
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public get paginatedResult(): PaginatedResult<HackerRankItem> {
    return this.paginatedResultSignal();
  }

  //#region Events

  public onPaginatedResult = effect(() => {
    const paginatedResult = this.paginatedResultSignal();
    this.hackerRankItems = this.hackerRankItems.concat(paginatedResult.items);
  });

  public onScroll(): void {
    this.currentPage++;
    this.search(this.searchTerm).subscribe();
  }

  public onSearch(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }

  //#endregion

  private search(
    searchTerm: string
  ): Observable<PaginatedResult<HackerRankItem>> {
    return this.searchService
      .search(searchTerm, this.currentPage)
      .pipe(
        tap((value: PaginatedResult<HackerRankItem>) =>
          this.paginatedResultSignal.set(value)
        )
      );
  }
}
