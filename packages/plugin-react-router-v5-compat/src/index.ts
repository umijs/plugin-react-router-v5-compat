import type { IApi } from 'umi';
import { logger } from 'umi/plugin-utils';
import { dirname } from 'path';
import { resolveProjectDep } from './utils/resolveProjectDep';

export default (api: IApi) => {
  api.describe({
    key: 'reactRouterV5Compat',
    config: {
      schema(Joi) {
        return Joi.alternatives().try(
          Joi.object(),
          Joi.boolean().invalid(true),
        );
      },
    },
    enableBy: api.EnableBy.config,
  });

  api.onStart(() => {
    logger.warn(
      'Currently running react-router v5 compatible version, please be careful not to use the react-router v6 api, or upgrade to v6 as soon as possible.',
    );
  });

  api.modifyRendererPath(() =>
    dirname(require.resolve('@umijs/renderer-react-v5/package.json')),
  );

  api.modifyDefaultConfig((config) => {
    // 处理三方依赖
    config.alias['react-router-dom'] =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'react-router-dom',
      }) || dirname(require.resolve('react-router-dom/package.json'));

    config.alias['react-router'] =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'react-router',
      }) || dirname(require.resolve('react-router/package.json'));

    config.alias['react-router-config'] =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'react-router-config',
      }) || dirname(require.resolve('react-router-config/package.json'));

    // react-router v5 版本 history 必须使用 4 版本
    config.alias['history'] =
      resolveProjectDep({
        pkg: api.pkg,
        cwd: api.cwd,
        dep: 'history',
      }) || dirname(require.resolve('history/package.json'));

    return config;
  });
};
