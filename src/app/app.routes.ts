import { Routes } from '@angular/router';

import { ClientPaginationComponent } from './pages/client-pagination/client-pagination.component';
import { HackerRankNewsResolver } from './resolvers/hacker-rank-news.resolver';
import { HackerRankNewsPaginatedResolver } from './resolvers/hacker-rank-news-paginated.resolver';
import { ServerPaginationComponent } from './pages/server-pagination/server-pagination.component';

export const routes: Routes = [
  { path: '', redirectTo: 'client-pagination', pathMatch: 'full' },
  {
    path: 'client-pagination',
    component: ClientPaginationComponent,
    resolve: { hackerRankItems: HackerRankNewsResolver },
  },
  {
    path: 'server-pagination',
    component: ServerPaginationComponent,
    resolve: { hackerRankItems: HackerRankNewsPaginatedResolver },
  },
];
