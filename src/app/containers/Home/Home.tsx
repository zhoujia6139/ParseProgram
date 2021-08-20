import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Layout } from '../Layout';
import { RouteConfig } from '@constants/routeConfig';
import * as _ from 'lodash';

export namespace Home {
  export interface Props extends RouteComponentProps<void> {}
}

export class Home extends React.PureComponent<Home.Props> {
  renderAllRoutes() {
    return _.map(_.filter(RouteConfig, (r) => r.entry) as RouteConfig[], (route) => {
      return (
        <li key={route.path}>
          <a href={`#${route.path}`}>{route.name}</a>
        </li>
      );
    });
  }
  render() {
    return (
      <Layout>
        <ul>{this.renderAllRoutes()}</ul>
      </Layout>
    );
  }
}
