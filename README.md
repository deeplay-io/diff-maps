# diff-maps [![npm version][npm-image]][npm-url] <!-- omit in toc -->

Calculate diff between two `Map`s

- [Installation](#installation)
- [Usage](#usage)

## Installation

```
npm install diff-maps
```

## Usage

Calculate diff:

```ts
import {diffMaps} from 'diff-maps';

expect(
  diffMaps(
    new Map([
      ['1', 0],
      ['2', 0],
    ]),
    new Map([
      ['2', 1],
      ['3', 1],
    ]),
  ),
).toEqual([
  {type: 'remove', key: '1', prevValue: 0},
  {type: 'change', key: '2', value: 1, prevValue: 0},
  {type: 'add', key: '3', value: 1},
]);
```

Use custom equality function (default is
[`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is)):

```ts
import {diffMaps} from 'diff-maps';
import {isEqual} from 'lodash';

expect(
  diffMaps(
    new Map([
      ['1', {data: 0}],
      ['2', {data: 0}],
    ]),
    new Map([
      ['1', {data: 0}],
      ['2', {data: 1}],
    ]),
    isEqual,
  ),
).toEqual([
  {
    type: 'change',
    key: '2',
    value: {data: 1},
    prevValue: {data: 0},
  },
]);
```

Apply diff:

```ts
import {applyDiff} from 'diff-maps';

const state = new Map([
  ['1', 0],
  ['2', 0],
]);

// mutates the map
applyDiff(state, [
  {type: 'remove', key: '1', prevValue: 0},
  {type: 'change', key: '2', value: 1, prevValue: 0},
  {type: 'add', key: '3', value: 1},
]);

expect(state).toEqual(
  new Map([
    ['2', 1],
    ['3', 1],
  ]),
);
```

Use with [Immutable.js](https://github.com/immutable-js/immutable-js):

```ts
import {Map} from 'immutable';

// calculate diff

expect(
  diffMaps(
    Map({
      1: 0,
      2: 0,
    }),
    Map({
      2: 1,
      3: 1,
    }),
  ),
).toEqual([
  {type: 'remove', key: '1', prevValue: 0},
  {type: 'change', key: '2', value: 1, prevValue: 0},
  {type: 'add', key: '3', value: 1},
]);

// apply diff

const state = Map({
  1: 0,
  2: 0,
});

const nextState = state.withMutations(mutableState => {
  applyDiff(mutableState, [
    {type: 'remove', key: '1', prevValue: 0},
    {type: 'change', key: '2', value: 1, prevValue: 0},
    {type: 'add', key: '3', value: 1},
  ]);
});

expect(new Map(nextState)).toEqual(
  new Map([
    ['2', 1],
    ['3', 1],
  ]),
);
```

[npm-image]: https://badge.fury.io/js/diff-maps.svg
[npm-url]: https://badge.fury.io/js/diff-maps
