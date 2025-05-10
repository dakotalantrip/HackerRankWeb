import { createHackerRankItem, createPaginatedResult } from "./test-data.factory";
import { HackerRankItem } from "../models/hacker-rank-item.model";
import { PaginatedResult } from "../models/paginated-result.model";

export const mockHackerRankItemList: HackerRankItem[] = Array.from({ length: 20 }, (_, index) => {
    const value = index + 1;
    return createHackerRankItem(value, `Title ${value}`, `Author ${value}`, 'https://....');
});

export const mockPaginatedResult: PaginatedResult<HackerRankItem> = createPaginatedResult<HackerRankItem>(mockHackerRankItemList, mockHackerRankItemList.length, Math.ceil(mockHackerRankItemList.length % 10));
