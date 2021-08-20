import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import * as apiUtils from '@utils/apiUtils';
import { AnyChart } from '@components/AnyChart/AnyChart';

const styles = StyleSheet.create({
  devChartWrapper: {}
});

export namespace DevChart {
  export interface Props {}
  export interface State {
    chartRes: any;
  }
}

export class DevChart extends React.PureComponent<DevChart.Props, DevChart.State> {
  chartId = React.createRef<any>();
  state = {
    chartRes: null
  };

  onLoadChart = async () => {
    const id = this.chartId.current.value;
    console.log(`id`, id);
    const chartRes = await apiUtils.fetchDevChart(id);
    this.setState({ chartRes: chartRes.data });
  };

  renderChart() {
    if (!this.state.chartRes) return null;
    const { chartType = 'lineMulti', chartData, graphAxis } = this.state.chartRes!;
    console.log(`chartData`, chartData, graphAxis);
    return (
      <AnyChart chartType={chartType} data={chartData} graphAxis={graphAxis} showSlider={true} />
    );
  }

  render() {
    return (
      <div className={css(styles.devChartWrapper)}>
        <div>
          Chart ID: <input type="text" name="chartId" ref={this.chartId} />
          <button onClick={this.onLoadChart}>Load</button>
        </div>
        <div>{this.renderChart()}</div>
      </div>
    );
  }
}
