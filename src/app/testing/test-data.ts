import { createHackerRankItem, createPaginatedResult } from "./test-data.factory";
import { HackerRankItem } from "../models/hacker-rank-item.model";
import { PaginatedResult } from "../models/paginated-result.model";

export const mockHackerRankItemList: HackerRankItem[] = [1, 2, 3, 4, 5].map((value: number) => {
    return createHackerRankItem(value, `Title ${value}`, `Author ${value}`, 'https://....')
}) ;

export const mockPaginatedResult: PaginatedResult<HackerRankItem> = createPaginatedResult<HackerRankItem>(mockHackerRankItemList, mockHackerRankItemList.length, 1);
