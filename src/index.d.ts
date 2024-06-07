import type { BunPlugin } from 'bun';

export default () => ({
  name: 'http-imports-plugin',
  setup: (build) => {},
} as const satisfies BunPlugin);
