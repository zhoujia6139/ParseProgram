import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { AnyChart, TableView } from '@components/index';
import Highlight from 'react-highlight';

const styles = StyleSheet.create({
  tableDetailWrapper: {}
});

export namespace TableDetail {
  export interface Props {
    data: MainTableTypes.RowDetail | null;
  }
  export interface State {}
}

export class TableDetail extends React.PureComponent<TableDetail.Props, TableDetail.State> {
  renderData() {
    if (!this.props.data) return 'Loading...';

    return (
      <div>
        {_.map(this.props.data, (value, key) => {
          if (value && (value as MainTableTypes.GraphItem).chartData) {
            const { chartData, graphAxis, chartType } = value as MainTableTypes.GraphItem;
            return (
              <div key={`chart${key}`}>
                <div>{key}: </div>
                <AnyChart
                  chartType={chartType}
                  data={chartData}
                  graphAxis={graphAxis}
                  showSlider={true}
                />
              </div>
            );
          } else if (value && value.tableData) {
            return <TableView key={key} data={value.tableData as any} />;
          }
          return null;
        })}
        <table>
          <tbody>
            {_.map(this.props.data, (value, key) => {
              if (key.match(/^action/)) {
                return (
                  <tr key={key}>
                    <td>{key}: </td>
                    <td dangerouslySetInnerHTML={{ __html: value }} />
                  </tr>
                );
              }
              if (_.isString(value) || _.isNumber(value)) {
                return (
                  <tr key={key}>
                    <td>{key}: </td>
                    <td>{value}</td>
                  </tr>
                );
              } else if (_.isObject(value) && !value.chartType && !value.tableData) {
                return (
                  <tr key={key}>
                    <td>{key}: </td>
                    <td>
                      <Highlight className="json">{JSON.stringify(value, null, 4)}</Highlight>
                    </td>
                  </tr>
                );
              } else if (_.isBoolean(value)) {
                return (
                  <tr key={key}>
                    <td>{key}: </td>
                    <td>{JSON.stringify(value)}</td>
                  </tr>
                );
              }
              return null;
            })}
          </tbody>
        </table>
      </div>
    );
  }
  render() {
    return <div className={css(styles.tableDetailWrapper)}>{this.renderData()}</div>;
  }
}
