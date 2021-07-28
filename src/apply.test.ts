import {Map as ImmutableMap} from 'immutable';
import {applyDiff} from './apply';

test('basic', () => {
  const state = new Map([
    ['1', 0],
    ['2', 0],
  ]);

  const diff = [
    {type: 'remove', key: '1', prevValue: 0},
    {type: 'change', key: '2', value: 1, prevValue: 0},
    {type: 'add', key: '3', value: 1},
  ];

  applyDiff(state, diff);

  expect(state).toEqual(
    new Map([
      ['2', 1],
      ['3', 1],
    ]),
  );
});

test('immutable', () => {
  const state = ImmutableMap({
    1: 0,
    2: 0,
  });

  const diff = [
    {type: 'remove', key: '1', prevValue: 0},
    {type: 'change', key: '2', value: 1, prevValue: 0},
    {type: 'add', key: '3', value: 1},
  ];

  const nextState = state.withMutations(state => {
    applyDiff(state, diff);
  });

  expect(new Map(nextState)).toEqual(
    new Map([
      ['2', 1],
      ['3', 1],
    ]),
  );
});
