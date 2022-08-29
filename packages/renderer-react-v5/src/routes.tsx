import React from 'react';
import { Redirect } from 'react-router-dom';
import { RouteContext } from './routeContext';
import { IClientRoute, IRoute, IRoutesById } from './types';
import type { RouteConfigComponentProps } from 'react-router-config';

export function createClientRoutes(opts: {
  routesById: IRoutesById;
  routeComponents: Record<string, any>;
  parentId?: string;
  loadingComponent?: React.ReactNode;
}) {
  const { routesById, parentId, routeComponents } = opts;
  return Object.keys(routesById)
    .filter((id) => routesById[id].parentId === parentId)
    .map((id) => {
      const route = createClientRoute({
        route: routesById[id],
        routeComponent: routeComponents[id],
        loadingComponent: opts.loadingComponent,
      });
      const children = createClientRoutes({
        routesById,
        routeComponents,
        parentId: route.id,
        loadingComponent: opts.loadingComponent,
      });
      if (children.length > 0) {
        route.children = children;
        // TODO: remove me
        // compatible with @ant-design/pro-layout
        route.routes = children;
      }
      return route;
    });
}

function createClientRoute(opts: {
  route: IRoute;
  routeComponent: any;
  loadingComponent?: React.ReactNode;
}): IClientRoute {
  const { route } = opts;
  const { redirect, ...props } = route;

  function RouteComponent(props: RouteConfigComponentProps) {
    if (redirect) {
      return <Redirect from={route.path} to={redirect} />;
    }

    // 这里的 route 与正常版本的含义是不一样的, 正常版本 的route 对应 originalRoute, 这有牺牲 不要纠结为啥叫 route
    return (
      <RouteContext.Provider
        value={{
          route: props,
          originalRoute: opts.route,
        }}
      >
        <RemoteComponent
          loader={opts.routeComponent}
          loadingComponent={opts.loadingComponent || DefaultLoading}
          route={props}
        />
      </RouteContext.Provider>
    );
  }
  return {
    component: (props: RouteConfigComponentProps) => (
      <RouteComponent {...props} />
    ),
    ...props,
  };
}

function DefaultLoading() {
  return <div />;
}

function RemoteComponent(props: any) {
  const useSuspense = true;
  if (useSuspense) {
    const Component = props.loader;
    return (
      <React.Suspense fallback={<props.loadingComponent />}>
        <Component {...props.route} />
      </React.Suspense>
    );
  } else {
    return null;
  }
}
