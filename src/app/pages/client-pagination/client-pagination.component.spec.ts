import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientPaginationComponent } from './client-pagination.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HackerRankItem } from '../../models/hacker-rank-item.model';

describe('ClientPaginationComponent', () => {
  let component: ClientPaginationComponent;
  let fixture: ComponentFixture<ClientPaginationComponent>;
  let data: HackerRankItem[] = [
    {
      id: 1,
      title: 'Item 1',
      author: 'Author 1',
      url: 'https://www.example.com',
    },
    {
      id: 2,
      title: 'Item 2',
      author: 'Author 2',
      url: 'https://www.example.com',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientPaginationComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                hackerRankItems: data,
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

  it('should load data from resolver', () => {
    expect(component.dataSource.data).toEqual(data);
  });
});
