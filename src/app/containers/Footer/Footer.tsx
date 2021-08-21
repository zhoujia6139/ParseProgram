import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
const styles = StyleSheet.create({
  footerContainer: {
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24
  }
});

export namespace Footer {
  export interface Props {}
}

export class Footer extends React.PureComponent<Footer.Props> {
  render() {
    return <div className={css(styles.footerContainer)}>All Rights Reserved</div>;
  }
}
