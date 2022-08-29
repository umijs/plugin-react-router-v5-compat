import React from 'react';
import type { RouteConfigComponentProps } from 'react-router-config';
import { IRoute } from './types';

export interface IRouteContextType {
  route: RouteConfigComponentProps;
  originalRoute: IRoute;
}
export const RouteContext = React.createContext<IRouteContextType | undefined>(
  undefined,
);

export function useRouteData(): IRouteContextType {
  return React.useContext(RouteContext)!;
}
