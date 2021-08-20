import * as React from 'react';
import { css, StyleSheet } from 'aphrodite/no-important';
import { NavBar } from '../NavBar';
import { Footer } from '../Footer';

const styles = StyleSheet.create({
  appContainer: {}
});

export namespace Layout {
  export interface Props {}
}

export class Layout extends React.PureComponent<Layout.Props> {
  render() {
    const { children } = this.props;
    return (
      <div className={css(styles.appContainer)}>
        <NavBar />
        {children}
        <Footer />
      </div>
    );
  }
}
