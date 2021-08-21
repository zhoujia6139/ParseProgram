import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { LinkButton } from '@components/index';
import { CommonColors } from '@styles/index';

const styles = StyleSheet.create({
  NavBarItemContainer: {},
  hoverBar: {
    ':after': {
      content: '""',
      position: 'absolute',
      width: 0,
      height: 4,
      transition: 'width 0.2s ease-in-out',
      transform: '',
      backgroundColor: CommonColors.ACCENT_PURPLE
    },
    ':hover:after': {
      width: 20
    }
  }
});

export namespace NavBarItem {
  export interface Props {
    label: string;
    href: string;
  }
}

export class NavBarItem extends React.PureComponent<NavBarItem.Props> {
  render() {
    const { label, href } = this.props;
    return (
      <div className={css(styles.NavBarItemContainer, styles.hoverBar)}>
        <LinkButton btnSize="sm" label={label} href={href} />
      </div>
    );
  }
}
