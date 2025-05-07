import { AfterViewInit, Component, effect, ElementRef, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatListModule, MatNavList } from '@angular/material/list';
import {
  BehaviorSubject,
  debounceTime,
  distinctUntilChanged,
  Observable,
  skip,
  Subject,
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
export class ServerPaginationComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatNavList, { read: ElementRef }) matNavList!: ElementRef;

  public hackerRankItems: HackerRankItem[] = [];
  public paginatedResultSignal = signal<PaginatedResult<HackerRankItem>>({
    items: [],
    totalItems: 0,
    totalPages: 0,
  });
  public searchTerm: string = '';

  private currentPageSubject: BehaviorSubject<number> = new BehaviorSubject<number>(1);
  private searchTermSubject: Subject<string> = new Subject<string>();
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
    this.subscription.add(
      this.searchTermSubject
        .pipe(
          distinctUntilChanged(),
          debounceTime(500),
          tap((value: string) => {
            this.searchTerm = value;
            this.hackerRankItems = [];
          }),
          switchMap((value: string) => this.search(value))
        )
        .subscribe()
    );

    this.subscription.add(
      this.currentPageSubject
        .asObservable()
        .pipe(
          skip(1),
          distinctUntilChanged(),
          switchMap(() => this.search(this.searchTerm))
        )
        .subscribe()
    );
  }

  ngAfterViewInit(): void {
    if (this.elementRef.nativeElement.scrollHeight >= this.matNavList.nativeElement.scrollHeight) {
      this.onScroll();
    }
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

  public onPaginatedResult = effect(() => {
    const paginatedResult = this.paginatedResultSignal();
    this.hackerRankItems = this.hackerRankItems.concat(paginatedResult.items);
  });

  public onScroll(): void {
    this.currentPageSubject.next(this.currentPage + 1);
  }

  public onSearch(searchTerm: string): void {
    this.currentPageSubject.next(1);
    this.searchTermSubject.next(searchTerm);
  }

  //#endregion

  private search(searchTerm: string): Observable<PaginatedResult<HackerRankItem>> {
    return this.hackerRankService
      .getNewPaginated(searchTerm, this.currentPage)
      .pipe(tap((value: PaginatedResult<HackerRankItem>) => this.paginatedResultSignal.set(value)));
  }
}
