import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  textContainer: {
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    borderBottom: `1px solid grey`,
    margin: '0 50px',
    padding: 20
  },
  componentTitle: {
    fontSize: 20,
    color: 'grey',
    paddingBottom: 20
  },
  componentDescription: {
    color: 'grey',
    fontSize: 16
  },
  centered: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }
});

interface SectionProps {
  children?: React.ReactNode;
  title: string;
  description: string;
  centered?: boolean;
}

const Section: React.SFC<SectionProps> = (props) => (
  <div>
    <div className={css(styles.textContainer)}>
      <h1 className={css(styles.componentTitle)}>{props.title}</h1>
      <h2 className={css(styles.componentDescription)}>{props.description}</h2>
    </div>
    <div className={css(props.centered && styles.centered)}>{props.children}</div>
  </div>
);

export default Section;
