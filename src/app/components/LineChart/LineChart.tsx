import * as React from 'react';
import * as _ from 'lodash';
import { Line, ChartData } from 'react-chartjs-2';
import { ChartDataSets, ChartOptions, ChartYAxe } from 'chart.js';

const useSameAxisThreshold = 5;
const baseChartOptions = {
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
    yAxes: [] as ChartYAxe[],
    xAxes: [
      {
        display: true
      }
    ]
  }
};

const colorCodes = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'grey'];

const commonAxisConfig = {
  hideInLegendAndTooltip: true,
  lineTension: 0,
  steppedLine: true,
  borderWidth: 1,
  pointRadius: 0,
  fill: false,
  backgroundColor: 'rgba(0,0,0,0)'
};

export namespace LineChart {
  export interface State {
    chartData: ChartData<{}>;
  }

  export interface Props {
    data: any[];
    graphAxis?: { id: string; label: string }[];
    width?: number;
    height?: number;
  }
}

function createAxis(id: string, labelString: string, position: string, fontColor: string) {
  return {
    id,
    display: true,
    scaleLabel: {
      display: true,
      labelString,
      fontColor
    },
    position
  };
}

export class LineChart extends React.Component<LineChart.Props, LineChart.State> {
  getAxisId(idx: number) {
    const { graphAxis, data } = this.props;
    if (graphAxis && graphAxis[idx]) return graphAxis[idx].id;
    const divide = data[0][idx + 1] / data[0][1];
    const divideLast = data[data.length - 1][idx + 1] / data[data.length - 1][1];
    if (
      divide > 1 / useSameAxisThreshold &&
      divide < useSameAxisThreshold &&
      (divideLast > 1 / useSameAxisThreshold && divideLast < useSameAxisThreshold)
    ) {
      return 'axis1';
    }
    return `axis${idx + 1}`;
  }

  getChartData() {
    const { data, graphAxis } = this.props;
    const datasets: ChartDataSets[] = [];
    for (let datasetIndex = 0; datasetIndex < data[0].length - 1; datasetIndex++) {
      datasets.push({
        ...commonAxisConfig,
        data: _.map(data, (i) => i[datasetIndex + 1]),
        label: (graphAxis && graphAxis[datasetIndex].label) || `col${datasetIndex + 1}`,
        borderColor: colorCodes[datasetIndex],
        yAxisID: this.getAxisId(datasetIndex)
      });
    }
    const chartData = (_canvas: HTMLElement) => {
      return {
        labels: _.map(data, (i) => i[0]),
        datasets
      };
    };
    return chartData;
  }

  getChartOptions(dataLength: number): ChartOptions {
    const chartOptions = _.cloneDeep(baseChartOptions);
    const { graphAxis = [] } = this.props;

    const createAxisIds: Record<string, 1> = {};

    for (let datasetIndex = 0; datasetIndex < dataLength - 1; datasetIndex++) {
      const id =
        (graphAxis[datasetIndex] && graphAxis[datasetIndex].id) || `axis${datasetIndex + 1}`;
      if (!createAxisIds[id]) {
        createAxisIds[id] = 1;
        chartOptions.scales.yAxes.push(
          createAxis(
            id,
            (graphAxis[datasetIndex] && graphAxis[datasetIndex].label) || colorCodes[datasetIndex],
            datasetIndex % 2 === 0 ? 'left' : 'right',
            colorCodes[datasetIndex]
          )
        );
      }
    }
    return chartOptions;
  }

  render() {
    const { data, width = 2000, height = 800 } = this.props;
    if (data.length == 0) return null;
    return (
      <Line
        redraw
        options={this.getChartOptions(data[0].length)}
        width={width}
        height={height}
        data={this.getChartData()}
      />
    );
  }
}
