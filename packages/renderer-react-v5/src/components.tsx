import React from 'react';
import { renderRoutes } from 'react-router-config';
import { useRouteData } from './routeContext';

export function Outlet() {
  const { route } = useRouteData();
  return <>{renderRoutes(route.route?.routes)}</>;
}
