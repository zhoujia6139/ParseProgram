import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  tableViewWrapper: {},
  tr: {},
  td: {
    border: '1px solid black',
    padding: '2px 6px'
  }
});

export namespace TableView {
  export interface Props {
    data: {
      headers: string[];
      rows: string[][];
    };
  }
  export interface State {}
}

export class TableView extends React.PureComponent<TableView.Props, TableView.State> {
  render() {
    const {
      data: { headers, rows }
    } = this.props;
    return (
      <table className={css(styles.tableViewWrapper)}>
        <thead>
          <tr className={css(styles.tr)}>
            {_.map(headers, (header, i) => (
              <th className={css(styles.td)} key={i}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(rows, (row, j) => (
            <tr className={css(styles.tr)} key={j}>
              {_.map(row, (col, i) => (
                <td className={css(styles.td)} key={i}>
                  {col}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
