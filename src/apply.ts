export type WriteonlyMap<K, V> = {
  set(key: K, value: V): unknown;
  delete(key: K): unknown;
};

export type AppliedDiffItem<Key, Value> = {
  key: Key;
  value?: Value | undefined;
};

export function applyDiff<Key extends string | number, Value>(
  state: WriteonlyMap<Key, Value>,
  diff: Array<AppliedDiffItem<Key, Value>>,
): void {
  for (const item of diff) {
    if (item.value !== undefined) {
      state.set(item.key, item.value);
    } else {
      state.delete(item.key);
    }
  }
}
