export interface PaginatedResult<T> {
  items: T[];
  totalPages: number;
  totalItems: number;
}
