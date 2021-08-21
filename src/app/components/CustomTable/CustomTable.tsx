import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { setItem, getItem } from '@utils/persistUtils';

const styles = StyleSheet.create({
  customTableWrapper: {},
  tableWrapper: {
    borderCollapse: 'collapse'
  },
  td: {
    border: '1px solid black',
    padding: 4
  },
  trHighLight: {
    background: '#eeeeee'
  },
  filterBtn: {
    display: 'flex'
  }
});

export namespace CustomTable {
  export interface Props {
    routePrefix: string;
    tableData: null | MainTableTypes.TableData;
    handleClick: (cell: MainTableTypes.ActionCell) => void;
    onUpdateFilters?: (newFilters: ColumnFilter[]) => void;
    onCheckBoxChange?: (checkedCheckboxes: boolean[]) => any;
    additionalActionButtons?: any;
  }
  export interface State {
    colFilterValues: boolean[];
    checkedCheckboxes: boolean[];
    extraFieldsText: string;
  }

  export interface ColumnFilter {
    header: string;
    show: boolean;
  }

  export interface StorageSchema {
    colFilterValues: boolean[];
    extraFieldsText: string;
  }
}

export class CustomTable extends React.Component<CustomTable.Props, CustomTable.State> {
  private filterMap: CustomTable.ColumnFilter[] = [];

  constructor(props: CustomTable.Props) {
    super(props);
    const colFilterValues: boolean[] = [];
    const extraFieldsText = '';
    this.state = {
      // this is the left side checkboxes
      checkedCheckboxes: [] as boolean[],
      colFilterValues,
      extraFieldsText
    };
  }

  componentWillReceiveProps(nextProps: Readonly<CustomTable.Props>, nextContext: any): void {
    if (nextProps.routePrefix !== this.props.routePrefix) {
      console.log(`====get`, `customTable-${nextProps.routePrefix}`);
      const dataStored = getItem(`customTable-${nextProps.routePrefix}`);
      if (dataStored) {
        const dataJson: CustomTable.StorageSchema = JSON.parse(dataStored);
        console.log(`====local storage`, dataJson);
        const colFilterValues = dataJson.colFilterValues;
        const extraFieldsText = dataJson.extraFieldsText;
        this.setState({ colFilterValues, extraFieldsText });
      }
    }
  }

  checkboxOnChange = (index: number) => {
    const { checkedCheckboxes } = this.state;
    const checkedCheckboxesClone = _.clone(checkedCheckboxes);
    checkedCheckboxesClone[index] = !checkedCheckboxesClone[index];
    this.setState({ checkedCheckboxes: checkedCheckboxesClone });
    this.props.onCheckBoxChange && this.props.onCheckBoxChange(checkedCheckboxesClone);
  };

  initFilters(len: number) {
    this.setState({ colFilterValues: new Array(len) });
  }

  componentDidMount() {
    if (
      this.props.tableData &&
      this.props.tableData.defaultHeaders &&
      this.props.tableData.defaultHeaders.length !== this.state.colFilterValues.length
    ) {
      this.initFilters(this.props.tableData.defaultHeaders.length);
    }
  }

  renderRow = (rowItems: (MainTableTypes.ActionCell | string)[], rowIdx: number) => {
    const id = rowItems[0];
    const innerContent = _.map(rowItems, (item, idx) => {
      if (_.isString(item)) {
        return (
          <td className={css(styles.td)} key={idx}>
            <a href={`#/${this.props.routePrefix}/${id}`}>{item}</a>
          </td>
        );
      }
      return (
        <td className={css(styles.td)} key={idx}>
          <button onClick={() => this.handleClick(item)}>{item && item.label}</button>
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

  handleClick = (cell: MainTableTypes.ActionCell, skipConfirm = false) => {
    if (!skipConfirm && cell.confirm) {
      const confirmed = window.confirm(`Are you sure want to ${cell && cell.label} ${cell.url} ?`);
      if (!confirmed) return;
    }
    this.props.handleClick(cell);
  };

  batchAction = (colIdx: number, label: string) => {
    const tableData: MainTableTypes.TableData = this.props.tableData!;
    const { rows } = tableData;
    const confirmed = window.confirm(`Are you sure want to batch ${label} all selected?`);
    if (!confirmed) return;
    _.each(rows, (row, rowIdx) => {
      if (!!this.state.checkedCheckboxes[rowIdx]) {
        this.handleClick(row[colIdx] as MainTableTypes.ActionCell, true);
      }
    });
  };

  onUpdateFilter = () => {
    const { colFilterValues, extraFieldsText } = this.state;
    this.filterMap = _.map(this.props.tableData!.defaultHeaders, (header, i) => {
      return {
        header,
        show: colFilterValues[i]
      };
    });
    const extraHeaders = _.map(extraFieldsText && extraFieldsText.split(','), (header) => {
      return {
        header,
        show: true
      };
    });
    // remove headers that already exists in extra headers
    this.filterMap = _.filter(
      this.filterMap,
      (f) => !_.find(extraHeaders, (e) => e.header === f.header)
    );
    this.props.onUpdateFilters && this.props.onUpdateFilters([...this.filterMap, ...extraHeaders]);
    setItem(`customTable-${this.props.routePrefix}`, { extraFieldsText, colFilterValues });
    console.log(`====store`, `customTable-${this.props.routePrefix}`, {
      extraFieldsText,
      colFilterValues
    });
  };

  onChangeFilter = (e: React.SyntheticEvent<any>, i: number) => {
    const colFilterValues = _.clone(this.state.colFilterValues);
    colFilterValues[i] = (e.target as any).checked;
    this.setState({ colFilterValues });
  };

  onChangeExtraFieldsText = (e: React.SyntheticEvent<any>) => {
    this.setState({ extraFieldsText: (e.target as any).value });
  };

  renderFilterPopOver() {
    return (
      <Popover id="customTablePopover">
        <Popover.Title as="h3">Filter Columns</Popover.Title>
        <Popover.Content>
          {_.map(this.props.tableData!.defaultHeaders, (header, i) => {
            return (
              <div key={header}>
                <input
                  type="checkbox"
                  id={`filter-${header}`}
                  name={header}
                  checked={this.state.colFilterValues[i]}
                  onChange={(e: React.SyntheticEvent) => this.onChangeFilter(e, i)}
                />
                &nbsp;<label htmlFor={`filter-${header}`}>{header}</label>
              </div>
            );
          })}
          <textarea
            value={this.state.extraFieldsText}
            onChange={this.onChangeExtraFieldsText}
            cols={40}
            rows={3}
          />
          <br />
          <Button onClick={this.onUpdateFilter}>Save</Button>
        </Popover.Content>
      </Popover>
    );
  }

  renderFilterBtn = () => {
    console.log(`additionalActionButtons`, this.props.additionalActionButtons);
    return (
      <div className={css(styles.filterBtn)}>
        <OverlayTrigger trigger="click" placement="right" overlay={this.renderFilterPopOver()}>
          <Button size="sm">Filter</Button>
        </OverlayTrigger>
        {this.props.additionalActionButtons}
      </div>
    );
  };

  renderLastRow = (data: MainTableTypes.TableData) => {
    if (data.rows.length === 0) return null;
    const innerContent = _.map(data.rows[0], (item, colIdx) => {
      if (_.isString(item)) return <td className={css(styles.td)} key={colIdx} />;
      return (
        <td className={css(styles.td)} key={colIdx}>
          <button
            disabled={!_.find(this.state.checkedCheckboxes, (c) => !!c)}
            onClick={() => this.batchAction(colIdx, item && item.label)}
          >
            Batch {item && item.label}
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

  renderTable(tableData: MainTableTypes.TableData) {
    return (
      <table className={css(styles.tableWrapper)}>
        <thead>
          <tr>
            <th className={css(styles.td)} />
            {_.map(tableData.headers, (header) => (
              <th className={css(styles.td)} key={header}>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_.map(tableData.rows, this.renderRow)}
          {this.renderLastRow(tableData)}
        </tbody>
      </table>
    );
  }

  render() {
    const { tableData } = this.props;
    return (
      <div className={css(styles.customTableWrapper)}>
        {tableData && this.renderFilterBtn()}
        {tableData && this.renderTable(tableData)}
      </div>
    );
  }
}
