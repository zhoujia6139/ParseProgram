import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { Scatter, ChartData } from 'react-chartjs-2';
import { createAxis } from '@utils/chartUtils';

const styles = StyleSheet.create({
  scatterChartWrapper: {}
});

export namespace ScatterChart {
  export interface Props {
    data: UI.Coord[][];
    width?: number;
    height?: number;
    graphAxis?: UI.GraphAxis[];
    isTimeAxis?: boolean;
  }
  export interface State {
    chartData: ChartData<{}>;
  }
}

const timeAxisConf = {
  type: 'time',
  time: {
    displayFormats: {
      millisecond: 'MM/DD/YY hh:mm:ss',
      second: 'MM/DD/YY hh:mm:ss',
      minute: 'MM/DD/YY hh:mm',
      hour: 'MM/DD/YY hh',
      day: 'MM/DD/YY',
      week: 'MM/DD/YY',
      month: 'MM/DD/YY',
      quarter: 'MM/DD/YY',
      year: 'MM/DD/YY'
    },
    tooltipFormat: 'MM/DD/YY hh:mm'
  }
};

const commonAxisConfig = {
  hideInLegendAndTooltip: true,
  steppedLine: true,
  borderWidth: 1,
  pointRadius: 3,
  fill: false,
  backgroundColor: 'rgba(0,0,0,0)'
};

const colorCodes = ['red', 'blue', 'green', 'grey', 'purple', 'pink', 'yellow'];

export class ScatterChart extends React.PureComponent<ScatterChart.Props, ScatterChart.State> {
  getChartData() {
    const { data, graphAxis = [] } = this.props;

    // each row is an array, with x, y1, y2
    const datasets: ChartDataSets[] = _.map(data, (dataset, i) => {
      return _.merge({}, commonAxisConfig, {
        data: dataset,
        label: (graphAxis[i] && graphAxis[i].label) || `col${i + 1}`,
        borderColor: graphAxis[i].color || colorCodes[i],
        backgroundColor: graphAxis[i].color || colorCodes[i],
        yAxisID: (graphAxis[i] && graphAxis[i].id) || `axis${i + 1}`
      });
    });
    const chartData = (canvas: HTMLElement) => {
      return {
        datasets
      };
    };
    console.log(`ScatterChart data`, datasets);
    return chartData;
  }
  getChartOptions(): ChartOptions {
    const { graphAxis = [], data, isTimeAxis } = this.props;

    const dataLength = data.length;
    const createAxisIds: Record<string, 1> = {};
    const yAxes: any = [];

    for (let datasetIndex = 0; datasetIndex < dataLength; datasetIndex++) {
      const id =
        (graphAxis[datasetIndex] && graphAxis[datasetIndex].id) || `axis${datasetIndex + 1}`;
      if (!createAxisIds[id]) {
        createAxisIds[id] = 1;
        yAxes.push(
          createAxis(
            id,
            (graphAxis[datasetIndex] && graphAxis[datasetIndex].label) || colorCodes[datasetIndex],
            yAxes.length % 2 === 0 ? 'left' : 'right',
            colorCodes[datasetIndex]
          )
        );
      }
    }
    return {
      animation: {
        duration: 0
      },
      legend: {
        display: true
      },
      title: {
        display: true
      },
      tooltips: {
        enabled: true,
        displayColors: false
      },
      scales: {
        yAxes: yAxes,
        xAxes: [
          {
            display: true,
            ...(isTimeAxis ? timeAxisConf : {})
          }
        ]
      }
    };
  }
  render() {
    const { data, width = 2000, height = 800 } = this.props;
    if (data.length == 0) return null;
    return (
      <div className={css(styles.scatterChartWrapper)}>
        <Scatter
          redraw
          options={this.getChartOptions()}
          width={width}
          height={height}
          data={this.getChartData()}
        />
      </div>
    );
  }
}
