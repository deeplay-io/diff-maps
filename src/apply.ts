import {DiffItem} from './diff';

export type WriteonlyMap<K, V> = {
  set(key: K, value: V): unknown;
  delete(key: K): unknown;
};

export function applyDiff<Key extends string | number, Value>(
  state: WriteonlyMap<Key, Value>,
  diff: Array<DiffItem<Key, Value>>,
): void {
  for (const item of diff) {
    if (item.type === 'add' || item.type === 'change') {
      state.set(item.key, item.value);
    } else if (item.type === 'remove') {
      state.delete(item.key);
    }
  }
}
