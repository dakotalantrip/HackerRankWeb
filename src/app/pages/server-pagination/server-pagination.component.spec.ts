import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { HackerRankService } from '../../services/hacker-rank.service';
import { mockPaginatedResult } from '../../testing/test-data';
import { ServerPaginationComponent } from './server-pagination.component';

describe('ServerPaginationComponent', () => {
  let component: ServerPaginationComponent;
  let fixture: ComponentFixture<ServerPaginationComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ServerPaginationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        HackerRankService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hackerRankItems: mockPaginatedResult,
              },
              paramMap: {
                get: (key: string) => (key === 'id' ? '123' : null),
              },
              queryParamMap: {
                get: (key: string) => (key === 'search' ? 'test' : null),
              },
            },
          },
        },
      ],
    });

    fixture = TestBed.createComponent(ServerPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data from resolver', () => {
    expect(component.paginatedResult).toEqual(mockPaginatedResult);
    expect(component.hackerRankItems).toEqual(mockPaginatedResult.items);
  });

  it('should increment current page when onScroll() is called', () => {
    const currentPage: number = component.currentPage;

    component.onScroll();

    expect(component.currentPage).toEqual(currentPage + 1);
  });

  it('should call search() with the correct searchTerm when currentPage is incremented', () => {
    const searchSpy = spyOn<any>(component, 'search').and.returnValue(
      of(mockPaginatedResult)
    );

    component.onScroll();
    fixture.detectChanges();

    expect(searchSpy).toHaveBeenCalledWith(component.searchTerm);
  });

  it('should call onSearch() when the search event is emitted from the search bar', () => {
    spyOn(component, 'onSearch');
    const searchTerm = 'Item 1';
    const searchBar = fixture.debugElement.query(
      By.css('app-search-bar')
    ).componentInstance;

    searchBar.search.emit(searchTerm);

    expect(component.onSearch).toHaveBeenCalledWith(searchTerm);
  });

  it('should call onScroll() when scrolled event is emitted from mat-nav-list', () => {
    spyOn(component, 'onScroll');
    const matNavList = fixture.debugElement.query(By.css('mat-nav-list'));
    matNavList.triggerEventHandler('scrolled', null);

    expect(component.onScroll).toHaveBeenCalled();
  });

  it('should render list of items', () => {
    component.paginatedResultSignal.set(mockPaginatedResult);
    fixture.detectChanges();

    const mockDataItem = mockPaginatedResult.items[0];
    const listItems = fixture.debugElement.queryAll(
      By.css('a.mat-mdc-list-item')
    );
    expect(listItems.length).toBe(mockPaginatedResult.items.length);
    expect(listItems[0].nativeElement.textContent).toContain(
      `${mockDataItem.title} - ${mockDataItem.author}`
    );
  });

  it('should render a message reading, "No results" when no results are found', () => {
    component.hackerRankItems = [];
    fixture.detectChanges();

    const noResultElement = fixture.debugElement.query(
      By.css('mat-nav-list span')
    );
    expect(noResultElement.nativeElement.textContent).toContain('No results');
  });
});
