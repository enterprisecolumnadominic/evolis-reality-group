//src/Data/PagedResponse

export interface PagedResponse<T> {
  items: T[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  nextToken: string | null;
  hasMore: boolean;
}
