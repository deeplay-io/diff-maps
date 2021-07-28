export type DiffItem<Key, Value, PrevValue = Value> =
  | DiffItemAdd<Key, Value>
  | DiffItemChange<Key, Value, PrevValue>
  | DiffItemRemove<Key, PrevValue>;

export type DiffItemAdd<Key, Value> = {
  type: 'add';
  key: Key;
  value: Value;
  prevValue?: undefined;
};

export type DiffItemChange<Key, Value, PrevValue> = {
  type: 'change';
  key: Key;
  value: Value;
  prevValue: PrevValue;
};

export type DiffItemRemove<Key, PrevValue> = {
  type: 'remove';
  key: Key;
  value?: undefined;
  prevValue: PrevValue;
};

export function diffMaps<
  Key extends string | undefined,
  Value,
  PrevValue = Value,
>(
  prevState: ReadonlyMap<Key, PrevValue>,
  nextState: ReadonlyMap<Key, Value>,
  equality: (prevValue: PrevValue, nextValue: Value) => boolean = Object.is,
): Array<DiffItem<Key, Value, PrevValue>> {
  const changes: Array<DiffItem<Key, Value, PrevValue>> = [];

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
