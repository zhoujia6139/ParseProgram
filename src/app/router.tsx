import * as React from 'react';
import * as _ from 'lodash';
import { Route } from 'react-router';
import '../assets/commonStyles.css';
import { Home, TextMetric } from '@containers/index';
import { hot } from 'react-hot-loader';
import { RouteConfig } from '@constants/routeConfig';
import { HashRouter } from 'react-router-dom';

const nameToComponentMap = {
  Home,
  TextMetric
};

export const App = hot(module)(() => (
  <HashRouter>
    <div>
      {_.map(RouteConfig, (config) => {
        return (
          <Route
            key={config.path}
            path={config.path}
            exact={config.exact}
            component={(nameToComponentMap as any)[config.name]}
          />
        );
      })}
    </div>
  </HashRouter>
));
