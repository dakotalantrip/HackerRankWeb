import { HackerRankItem } from "../models/hacker-rank-item.model";
import { PaginatedResult } from "../models/paginated-result.model";

export function createHackerRankItem(
    id: number,
    title: string = 'Title',
    author: string = 'Author',
    url: string = 'https://www.example.com'
  ): HackerRankItem {
    return { id, title, author, url };
  }

export function createPaginatedResult<T>(
    items: T[],
    totalItems: number,
    totalPages: number
): PaginatedResult<T> {
    return { items: items, totalItems: totalItems, totalPages: totalPages }
}