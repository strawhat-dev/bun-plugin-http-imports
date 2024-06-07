/** @type {import('bun').Transpiler} */
let transpiler;

const loadJS = async (js) => {
  transpiler ??= new Bun.Transpiler({
    loader: 'tsx',
    target: 'bun',
    minifyWhitespace: false,
    trimUnusedImports: false,
    deadCodeElimination: false,
  });

  const callback = async () => {
    const transform = transpiler.transform.bind(transpiler);
    const code = await transform(js).then((js) => js.trim());
    const contents = code.replace(/"input\.tsx"\);$/, '"input.tsx")();');
    return { loader: 'js', contents };
  };

  return callback().catch(() => loadJSON(js));
};

const loadHTML = async (html) => {
  const callback = async () => {
    const { window } = await import('linkedom').then(({ parseHTML }) => parseHTML(html));
    const { navigator, document, Document, Element, Node } = window;
    const props = { window, navigator, document, Document, Element, Node };
    return { loader: 'object', exports: { ...props, default: window } };
  };

  return callback().catch(() => loadJSON(html));
};

// prettier-ignore
const loadJSON = (contents) => {
  if (typeof contents !== 'object') {
    try { contents = JSON.parse(contents); } catch {
      contents = `export default ${JSON.stringify(contents)}`;
      return { loader: 'js', contents };
    }
  }

  return {
    loader: 'object',
    exports: { ...contents, default: contents }
  };
};

const dispatch = /** @type {const} */ ({
  plain: { method: 'text', load: loadJS },
  html: { method: 'text', load: loadHTML },
  json: { method: 'json', load: loadJSON },
  javascript: { method: 'text', load: loadJS },
});

/** @returns {import('bun').OnLoadCallback} */
const resolve = (protocol) => async ({ path }) => {
  const res = await fetch([protocol, path].join(':'));
  if (!res.ok) return Promise.reject(TypeError('Failed to fetch url import'));
  const type = res.headers.get('content-type').split(';').shift().split('/').pop();
  const { method, load } = dispatch[type in dispatch ? type : 'javascript'];
  return res[method]().then(load);
};

export default () => /** @type {const} */ ({
  name: 'http-imports-plugin',
  setup(http_import) {
    http_import.onResolve({ filter: /^https?:\/\// }, ({ path }) => ({ path }));
    ['http', 'https'].forEach((namespace) => (
      http_import.onLoad({ filter: /./, namespace }, resolve(namespace))
    ));
  },
});
