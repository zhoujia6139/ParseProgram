export interface RouteConfig {
  name: string;
  path: string;
  entry?: boolean;
  exact?: boolean;
}

export const RouteConfig: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    exact: true
  },
  {
    name: 'TextMetric',
    path: '/text-metric',
    entry: true
  },
  {
    name: 'DevChart',
    path: '/dev-chart',
    exact: true
  }
];
