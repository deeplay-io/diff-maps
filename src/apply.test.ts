import {Map as ImmutableMap} from 'immutable';
import {applyDiff} from './apply';

test('basic', () => {
  const state = new Map([
    ['1', 0],
    ['2', 0],
  ]);

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
});

test('immutable', () => {
  const state = ImmutableMap({
    1: 0,
    2: 0,
  });

  const nextState = state.withMutations(state => {
    applyDiff(state, [
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
});
