import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  BodyWrapper: {
    padding: 24
  }
});

export namespace BodyWrapper {
  export interface Props {}
  export interface State {}
}

export class BodyWrapper extends React.PureComponent<BodyWrapper.Props, BodyWrapper.State> {
  render() {
    const { children } = this.props;
    return <div className={css(styles.BodyWrapper)}>{children}</div>;
  }
}
