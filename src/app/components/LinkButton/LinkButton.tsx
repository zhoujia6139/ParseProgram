import * as React from 'react';
import * as _ from 'lodash';
import { css, StyleSheet } from 'aphrodite';
import { StyleConstants } from '@styles/index';

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    cursor: 'pointer',
    textDecoration: 'none',
    ':hover': {
      transform: StyleConstants.defaultScaleDown
    }
  },
  primary: StyleConstants.primaryLinkButtonStyle,
  sm: StyleConstants.fontSize.sm,
  md: StyleConstants.fontSize.md,
  lg: StyleConstants.fontSize.lg
});

export namespace LinkButton {
  export type Theme = 'primary';
  export interface Props extends React.AllHTMLAttributes<HTMLAnchorElement> {
    theme?: Theme;
    label: string;
    btnSize?: UI.SizeSML;
  }
}

export class LinkButton extends React.PureComponent<LinkButton.Props, {}> {
  render() {
    const { label, theme = 'primary', onClick, btnSize = 'md', ...htmlProps } = this.props;

    const containerStyles = _.compact([styles.root, styles[theme], styles[btnSize]]);
    return (
      <a className={css(containerStyles)} onClick={onClick} {...htmlProps}>
        {label}
      </a>
    );
  }
}
