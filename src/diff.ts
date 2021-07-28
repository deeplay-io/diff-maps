export type DiffItem<Key, Value> =
  | DiffItemAdd<Key, Value>
  | DiffItemChange<Key, Value>
  | DiffItemRemove<Key, Value>;

export type DiffItemAdd<Key, Value> = {
  type: 'add';
  key: Key;
  value: Value;
  prevValue?: undefined;
};

export type DiffItemChange<Key, Value> = {
  type: 'change';
  key: Key;
  value: Value;
  prevValue: Value;
};

export type DiffItemRemove<Key, Value> = {
  type: 'remove';
  key: Key;
  value?: undefined;
  prevValue: Value;
};

export function diffMaps<Key extends string | undefined, Value>(
  prevState: ReadonlyMap<Key, Value>,
  nextState: ReadonlyMap<Key, Value>,
  equality: (a: Value, b: Value) => boolean = Object.is,
): Array<DiffItem<Key, Value>> {
  const changes: Array<DiffItem<Key, Value>> = [];

  for (const [key, value] of prevState) {
    if (!nextState.has(key)) {
      changes.push({
        type: 'remove',
        key,
        prevValue: value,
      });
    }
  }

  for (const [key, nextValue] of nextState) {
    const prevValue = prevState.get(key);

    if (prevValue == null) {
      changes.push({
        type: 'add',
        key,
        value: nextValue,
      });
    } else if (!equality(prevValue, nextValue)) {
      changes.push({
        type: 'change',
        key,
        value: nextValue,
        prevValue,
      });
    }
  }

  return changes;
}
