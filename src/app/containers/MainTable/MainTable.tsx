import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import * as apiUtils from '@utils/apiUtils';
import { handleClick } from './mainTableUtils';
import * as _ from 'lodash';

const styles = StyleSheet.create({
  mainTableWrapper: {},
  tableWrapper: {
    borderCollapse: 'collapse'
  },
  td: {
    border: '1px solid black',
    padding: 4
  },
  trHighLight: {
    background: '#eeeeee'
  }
});

export namespace MainTable {
  export interface Props {}
  export interface State {
    tableData: null | MainTableTypes.TableData;
    checkedCheckboxes: Record<string, boolean>;
  }
}

export class MainTable extends React.PureComponent<MainTable.Props, MainTable.State> {
  state = {
    tableData: null,
    checkedCheckboxes: {} as Record<string, boolean>
  };

  async componentDidMount() {
    const response = (await apiUtils.fetchMainTable()) as any;
    this.setState({ tableData: response.data });
  }

  checkboxOnChange = (index: number) => {
    const { checkedCheckboxes } = this.state;
    const checkedCheckboxesClone = _.clone(checkedCheckboxes);
    checkedCheckboxesClone[index] = !checkedCheckboxesClone[index];
    this.setState({ checkedCheckboxes: checkedCheckboxesClone });
  };

  renderRow = (rowItems: (MainTableTypes.ActionCell | string)[], rowIdx: number) => {
    const id = rowItems[0];
    const innerContent = _.map(rowItems, (item, idx) => {
      if (_.isString(item))
        return (
          <td className={css(styles.td)} key={idx}>
            <a href={`#/detail/${id}`}>{item}</a>
          </td>
        );
      return (
        <td className={css(styles.td)} key={idx}>
          <button onClick={() => handleClick(item)}>{item.label}</button>
        </td>
      );
    });
    return (
      <tr key={rowIdx} className={css(this.state.checkedCheckboxes[rowIdx] && styles.trHighLight)}>
        <td className={css(styles.td)}>
          <input
            type="checkbox"
            checked={!!this.state.checkedCheckboxes[rowIdx]}
            onChange={() => this.checkboxOnChange(rowIdx)}
          />
        </td>
        {innerContent}
      </tr>
    );
  };

  batchAction = (colIdx: number, label: string) => {
    const tableData: MainTableTypes.TableData = this.state.tableData!;
    const { rows } = tableData;
    const confirmed = window.confirm(`Are you sure want to batch ${label} all selected?`);
    if (!confirmed) return;
    _.each(rows, (row, rowIdx) => {
      if (!!this.state.checkedCheckboxes[rowIdx]) {
        handleClick(row[colIdx] as MainTableTypes.ActionCell);
      }
    });
  };

  renderLastRow = (data: MainTableTypes.TableData) => {
    if (data.rows.length === 0) return null;
    const innerContent = _.map(data.rows[0], (item, colIdx) => {
      if (_.isString(item)) return <td className={css(styles.td)} key={colIdx} />;
      return (
        <td className={css(styles.td)} key={colIdx}>
          <button
            disabled={!_.find(this.state.checkedCheckboxes, (c) => !!c)}
            onClick={() => this.batchAction(colIdx, item.label)}
          >
            Batch {item.label}
          </button>
        </td>
      );
    });
    return (
      <tr>
        <td className={css(styles.td)} />
        {innerContent}
      </tr>
    );
  };

  renderTable(data: MainTableTypes.TableData) {
    return (
      <table className={css(styles.tableWrapper)}>
        <thead>
          <tr>
            <th className={css(styles.td)} />
            {_.map(data.headers, (header) => (
              <th className={css(styles.td)} key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(data.rows, this.renderRow)}
          {this.renderLastRow(data)}
        </tbody>
      </table>
    );
  }

  render() {
    return (
      <div className={css(styles.mainTableWrapper)}>
        {!this.state.tableData && `Loading...`}
        {this.state.tableData && this.renderTable(this.state.tableData!)}
      </div>
    );
  }
}
