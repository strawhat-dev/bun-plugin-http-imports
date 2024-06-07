await import('./src').then((module) => Bun.plugin(module.default()));
