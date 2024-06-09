/** Given a type T and key K, makes K required while keeping other keys as-is. */
export type WithRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
