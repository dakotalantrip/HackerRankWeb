import { Component, effect, ElementRef, OnDestroy, OnInit, signal, ViewChild, viewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatListModule, MatNavList } from '@angular/material/list';
import {
  BehaviorSubject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  Observable,
  skip,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';

import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

import { HackerRankItem } from '../../models/hacker-rank-item.model';
import { HackerRankService } from '../../services/hacker-rank.service';
import { PaginatedResult } from '../../models/paginated-result.model';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-server-pagination',
  imports: [InfiniteScrollDirective, MatListModule, SearchBarComponent],
  templateUrl: './server-pagination.component.html',
  styleUrl: './server-pagination.component.scss',
})
export class ServerPaginationComponent implements OnInit, OnDestroy {
  @ViewChild(MatNavList, { read: ElementRef }) matNavList!: ElementRef;

  public hackerRankItems: HackerRankItem[] = [];
  public listItemsSignal = viewChildren<ElementRef>('listItem');
  public paginatedResultSignal = signal<PaginatedResult<HackerRankItem>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
  });

  private currentPageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private searchTermSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  private subscription: Subscription = new Subscription();

  constructor(
    private elementRef: ElementRef,
    private hackerRankService: HackerRankService,
    private route: ActivatedRoute
  ) {
    const routeData = (this.route.snapshot?.data['hackerRankItems'] as PaginatedResult<HackerRankItem>) ?? {
      items: [],
      totalItems: 0,
      totalPages: 0,
    };

    this.paginatedResultSignal.set(routeData);
  }

  //#region Lifecycle

  ngOnInit(): void {
    const searchTerm$ = this.searchTermSubject
        .pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap(() => {
            this.currentPageSubject.next(1);
          })
        );

    const currentPage$ = this.currentPageSubject
        .asObservable()
        .pipe(
          distinctUntilChanged(),
        );

      this.subscription.add(
        combineLatest([searchTerm$, currentPage$])
        .pipe(
          skip(1),
          debounceTime(100),
          switchMap(([searchTerm, currentPage]) => {
            return this.search(searchTerm);
          })
        )
        .subscribe()
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  //#endregion

  //#region Getters

  public get currentPage(): number {
    return this.currentPageSubject.value;
  }

  public get paginatedResult(): PaginatedResult<HackerRankItem> {
    return this.paginatedResultSignal();
  }

  //#endregion

  //#region Events

  public onListItemChanges = effect(() => {
    const listItems = this.listItemsSignal();
    setTimeout(() => {
      if (this.elementRef?.nativeElement.scrollHeight >= this.matNavList?.nativeElement.scrollHeight) {
        this.onScroll();
      }
    }, 0);
  });

  public onPaginatedResult = effect(() => {
    const paginatedResult = this.paginatedResultSignal();
    this.hackerRankItems = this.currentPage === 1 ? paginatedResult.items : this.hackerRankItems.concat(paginatedResult.items);
  });

  public onScroll(): void {
    if (this.paginatedResult.totalPages > this.currentPage) {
      this.currentPageSubject.next(this.currentPage + 1);
    }
  }

  public onSearch(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }

  //#endregion

  private search(searchTerm: string): Observable<PaginatedResult<HackerRankItem>> {
    return this.hackerRankService
      .getNewPaginated(searchTerm, this.currentPage)
      .pipe(tap((value: PaginatedResult<HackerRankItem>) => this.paginatedResultSignal.set(value)));
  }
}
