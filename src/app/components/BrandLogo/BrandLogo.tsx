import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  brandLogoWrapper: {}
});

export namespace BrandLogo {
  export interface Props {
    src: string;
  }
  export interface State {}
}

export class BrandLogo extends React.PureComponent<BrandLogo.Props, BrandLogo.State> {
  render() {
    const { src } = this.props;
    return (
      <div className={css(styles.brandLogoWrapper)}>
        <img src={src} />
      </div>
    );
  }
}
