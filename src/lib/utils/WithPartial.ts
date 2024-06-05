/** Given a type T and key K, makes K optional while keeping other keys as-is. */
export type WithPartial<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
