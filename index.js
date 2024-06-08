await import('./plugin').then((plugin) => Bun.plugin(plugin.default()));

export {};
