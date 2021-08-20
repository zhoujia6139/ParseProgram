import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  headerWrapper: {}
});

export namespace Header {
  export interface Props {
    text: string;
  }
  export interface State {}
}

export class Header extends React.PureComponent<Header.Props, Header.State> {
  render() {
    return <h2 className={css(styles.headerWrapper)}>{this.props.text}</h2>;
  }
}
