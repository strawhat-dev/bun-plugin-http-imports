import { expect, test } from 'bun:test';

test('cdn import', async () => {
  const _ = (await import('https://cdn.jsdelivr.net/npm/lodash')).default;
  expect(_.add(2, 2)).toBe(4);
});

test('cdn import (esm)', async () => {
  const { add } = await import('https://esm.run/lodash-es');
  expect(add(2, 2)).toBe(4);
});

test('json import', async () => {
  const data = await import('https://jsonplaceholder.typicode.com/users/1');
  expect(data.id).toBe(1);
});

test('html import', async () => {
  const { document } = await import('https://motherfuckingwebsite.com');
  const { textContent } = document.querySelector('h1');
  expect(textContent).toBe('This is a motherfucking website.');
});
