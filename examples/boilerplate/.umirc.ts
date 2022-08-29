import extraConfig from './extraConfig';

export default {
  // basename 支持 需要 调整 history 生成 见这里 https://github.com/remix-run/history/tree/v4.7.2
  // base: '/foo',
  // publicPath: '/foo/',
  // history: { type: 'hash' },
  plugins: [require.resolve('@umijs/plugin-react-router-v5-compat')],
  routes: [
    { path: '/', component: 'index', exact: true },
    {
      path: '/users',
      component: 'users',
      routes: [
        {
          path: '/users/foo',
          component: 'users/foo',
          exact: true,
        },
        {
          path: '/users/login',
          component: 'users/login',
          exact: true,
        },
        {
          path: '/users/:id',
          component: 'users/$id',
          wrappers: ['@/wrappers/foo', '@/wrappers/bar'],
        },
      ],
    },
    {
      path: '/about',
      component: 'about',
      exact: true,
    },
    {
      path: '/class-component/:id',
      component: 'class-component',
    },
    {
      path: '*',
      component: '@/components/404',
    },
  ],
  reactRouterV5Compat: {},
  externals: {
    marked: [
      'script https://gw.alipayobjects.com/os/lib/marked/2.0.0/marked.min.js',
      'marked',
    ],
    '@antv/g2': [
      'script https://gw.alipayobjects.com/os/lib/antv/g2/3.5.19/dist/g2.min.js',
      'G2',
    ],
    '@antv/g6': [
      'script https://gw.alipayobjects.com/os/lib/antv/g6/4.1.16/dist/g6.min.js',
      'G6',
    ],
  },
  chainWebpack(memo: any) {
    memo;
  },
  // mfsu 在工作区不能使用 因为不会编译 renderer-react-v5 导致多实列
  mfsu: false,
  // vite: {},
  deadCode: {},
  https: {},
  // fastRefresh: false,
  // favicon: 'https://sivers.com/favicon.ico',
  headScripts: [`console.log('head script')`],
  // scripts: [`console.log('script')`],
  npmClient: 'pnpm',
  svgr: {},
  clickToComponent: {
    editor: 'vscode-insiders',
  },
  crossorigin: {},
  // srcTranspiler: 'swc',
  // esmi: {},
  // esm: {},
  lowImport: false,
  title: 'boilerplate - umi 4',
  cssMinifier: 'parcelCSS',
  cssMinifierOptions: {
    targets: {
      chrome: 60,
    },
  },
  cacheDirectoryPath: 'node_modules/.cache1',
  metas: [
    {
      name: 'viewport',
      content: `width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no`,
    },
    {
      'http-equiv': 'X-UA-Compatible',
      content: 'IE=edge,chrome=1',
    },
    {
      name: 'description',
      content: 'umijs',
    },
  ],
  styles: ['//cdn.bootcdn.net/ajax/libs/normalize/8.0.1/normalize.min.css'],
  ...extraConfig,
};
