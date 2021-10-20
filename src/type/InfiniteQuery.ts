export interface InfiniteQueryResponse<T extends Record<'id', number>> {
  resources: T[];
  nextCursor?: T['id'];
}
