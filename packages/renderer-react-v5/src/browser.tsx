import { History } from 'history';
import React from 'react';
// compatible with < react@18 in @umijs/preset-umi/src/features/configPlugins/configPlugins
import ReactDOM from 'react-dom/client';
import { Router } from 'react-router-dom';
import { AppContext } from './appContext';
import { createClientRoutes } from './routes';
import { IRouteComponents, IRoutesById } from './types';
import { renderRoutes } from 'react-router-config';

let root: ReactDOM.Root | null = null;

// react 18 some scenarios need unmount such as micro app
export function __getRoot() {
  return root;
}

function BrowserRoutes(props: {
  routes: any;
  clientRoutes: any;
  pluginManager: any;
  history: History;
  basename: string;
  children: any;
}) {
  const { history } = props;
  const [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });
  // @ts-ignore
  React.useLayoutEffect(() => history.listen(setState), [history]);
  React.useLayoutEffect(() => {
    function onRouteChange(location: any, action: any) {
      props.pluginManager.applyPlugins({
        key: 'onRouteChange',
        type: 'event',
        args: {
          routes: props.routes,
          clientRoutes: props.clientRoutes,
          location: location,
          action: action,
        },
      });
    }
    history.listen(onRouteChange);
    onRouteChange(state.location, state.action);
  }, [history, props.routes, props.clientRoutes]);

  return <Router history={history}>{props.children}</Router>;
}

export function renderClient(opts: {
  publicPath?: string;
  runtimePublicPath?: boolean;
  rootElement?: HTMLElement;
  routes: IRoutesById;
  routeComponents: IRouteComponents;
  pluginManager: any;
  basename?: string;
  loadingComponent?: React.ReactNode;
  history: History;
  hydrate?: boolean;
}) {
  const basename = opts.basename || '/';
  const rootElement = opts.rootElement || document.getElementById('root')!;
  const clientRoutes = createClientRoutes({
    routesById: opts.routes,
    routeComponents: opts.routeComponents,
    loadingComponent: opts.loadingComponent,
  }) as any;

  opts.pluginManager.applyPlugins({
    key: 'patchClientRoutes',
    type: 'event',
    args: {
      routes: clientRoutes,
    },
  });

  let rootContainer = (
    <BrowserRoutes
      basename={basename}
      pluginManager={opts.pluginManager}
      routes={opts.routes}
      clientRoutes={clientRoutes}
      history={opts.history}
    >
      {renderRoutes(clientRoutes)}
    </BrowserRoutes>
  );
  for (const key of [
    // Lowest to the highest priority
    'innerProvider',
    'i18nProvider',
    'accessProvider',
    'dataflowProvider',
    'outerProvider',
    'rootContainer',
  ]) {
    rootContainer = opts.pluginManager.applyPlugins({
      type: 'modify',
      key: key,
      initialValue: rootContainer,
      args: {},
    });
  }

  const Browser = () => {
    return (
      <AppContext.Provider
        value={{
          routes: opts.routes,
          routeComponents: opts.routeComponents,
          clientRoutes,
          pluginManager: opts.pluginManager,
          rootElement: opts.rootElement!,
          basename,
        }}
      >
        {rootContainer}
      </AppContext.Provider>
    );
  };

  if (opts.hydrate) {
    ReactDOM.hydrateRoot(rootElement, <Browser />);
  } else {
    if (ReactDOM.createRoot) {
      root = ReactDOM.createRoot(rootElement);
      root.render(<Browser />);
    } else {
      // @ts-ignore
      ReactDOM.render(<Browser />, rootElement);
    }
  }
}
