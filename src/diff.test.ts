import {Map as ImmutableMap} from 'immutable';
import {diffMaps} from './diff';

type Value = {id: string; data: string};

function isEqual(a: Value, b: Value) {
  return a.id === b.id && a.data === b.data;
}

test('basic', () => {
  expect(
    diffMaps<string, Value>(
      new Map(),
      new Map()
        .set('1', {id: 'id-1', data: 'data-1'})
        .set('2', {id: 'id-2', data: 'data-2'}),
      isEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "key": "1",
        "type": "add",
        "value": Object {
          "data": "data-1",
          "id": "id-1",
        },
      },
      Object {
        "key": "2",
        "type": "add",
        "value": Object {
          "data": "data-2",
          "id": "id-2",
        },
      },
    ]
  `);

  expect(
    diffMaps<string, Value>(
      new Map()
        .set('1', {id: 'id-1', data: 'data-1'})
        .set('2', {id: 'id-2', data: 'data-2'}),
      new Map(),
      isEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "key": "1",
        "prevValue": Object {
          "data": "data-1",
          "id": "id-1",
        },
        "type": "remove",
      },
      Object {
        "key": "2",
        "prevValue": Object {
          "data": "data-2",
          "id": "id-2",
        },
        "type": "remove",
      },
    ]
  `);

  expect(
    diffMaps<string, Value>(
      new Map().set('1', {id: 'id-1', data: 'data-1'}),
      new Map().set('2', {id: 'id-2', data: 'data-2'}),
      isEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "key": "1",
        "prevValue": Object {
          "data": "data-1",
          "id": "id-1",
        },
        "type": "remove",
      },
      Object {
        "key": "2",
        "type": "add",
        "value": Object {
          "data": "data-2",
          "id": "id-2",
        },
      },
    ]
  `);

  expect(
    diffMaps<string, Value>(
      new Map()
        .set('1', {id: 'id-1', data: 'data-1'})
        .set('2', {id: 'id-2', data: 'data-2'}),
      new Map()
        .set('2', {id: 'id-2', data: 'data-2'})
        .set('3', {id: 'id-3', data: 'data-3'}),
      isEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "key": "1",
        "prevValue": Object {
          "data": "data-1",
          "id": "id-1",
        },
        "type": "remove",
      },
      Object {
        "key": "3",
        "type": "add",
        "value": Object {
          "data": "data-3",
          "id": "id-3",
        },
      },
    ]
  `);

  expect(
    diffMaps<string, Value>(
      new Map().set('1', {id: 'id-1', data: 'data-1-1'}),
      new Map().set('1', {id: 'id-1', data: 'data-1-2'}),
      isEqual,
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "key": "1",
        "prevValue": Object {
          "data": "data-1-1",
          "id": "id-1",
        },
        "type": "change",
        "value": Object {
          "data": "data-1-2",
          "id": "id-1",
        },
      },
    ]
  `);
});

test('equality', () => {
  expect(
    diffMaps<string, Value>(
      new Map().set('1', {id: 'id-1', data: 'data-1-1'}),
      new Map().set('1', {id: 'id-1', data: 'data-1-2'}),
      (a, b) => a.id === b.id,
    ),
  ).toMatchInlineSnapshot(`Array []`);
});

test('immutable', () => {
  expect(
    diffMaps(
      ImmutableMap({
        1: 0,
        2: 0,
      }),
      ImmutableMap({
        2: 1,
        3: 1,
      }),
    ),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "key": "1",
        "prevValue": 0,
        "type": "remove",
      },
      Object {
        "key": "2",
        "prevValue": 0,
        "type": "change",
        "value": 1,
      },
      Object {
        "key": "3",
        "type": "add",
        "value": 1,
      },
    ]
  `);
});
