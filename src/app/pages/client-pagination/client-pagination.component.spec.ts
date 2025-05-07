import { ActivatedRoute } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPaginationComponent } from './client-pagination.component';
import { mockHackerRankItemList } from '../../testing/test-data';

describe('ClientPaginationComponent', () => {
  let component: ClientPaginationComponent;
  let fixture: ComponentFixture<ClientPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPaginationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hackerRankItems: mockHackerRankItemList,
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
    }).compileComponents();

    fixture = TestBed.createComponent(ClientPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain appropriate field names for the displayed columns', () => {
    const hackerRankItemKeys = Object.keys(mockHackerRankItemList[0]);
    component.displayedColumns.forEach((column) => {
      expect(hackerRankItemKeys).toContain(column);
    });
  });

  it('should load data from resolver', () => {
    expect(component.dataSource.data).toEqual(mockHackerRankItemList);
  });

  it('should filter the dataSource when onSearch() is called', () => {
    const searchTerm = 'Item 1';
    component.onSearch(searchTerm);

    expect(component.dataSource.filter).toBe(searchTerm);
  });
});
