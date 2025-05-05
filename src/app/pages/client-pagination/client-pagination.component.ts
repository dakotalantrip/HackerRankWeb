import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { HackerRankItem } from '../../models/hacker-rank-item.model';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';

@Component({
  selector: 'app-client-pagination',
  imports: [
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    SearchBarComponent,
  ],
  templateUrl: './client-pagination.component.html',
  styleUrl: './client-pagination.component.scss',
})
export class ClientPaginationComponent implements AfterViewInit {
  @ViewChild(MatPaginator) matPaginator!: MatPaginator;
  @ViewChild(MatSort) matSort!: MatSort;

  public dataSource = new MatTableDataSource<HackerRankItem>([]);
  public displayedColumns = ['title', 'author', 'url'];

  constructor(private route: ActivatedRoute) {
    const hackerRankItems: HackerRankItem[] =
      this.route.snapshot.data['hackerRankItems'] ?? [];
    this.dataSource.data = hackerRankItems;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.matPaginator;
    this.dataSource.sort = this.matSort;
  }

  public onSearch(searchTerm: string): void {
    this.dataSource.filter = searchTerm;
  }
}
