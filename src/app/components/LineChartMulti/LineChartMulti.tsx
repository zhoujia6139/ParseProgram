import * as React from 'react';
import * as _ from 'lodash';
import { Line } from 'react-chartjs-2';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { createAxis } from '@utils/chartUtils';
import { Slider } from '@material-ui/core';

export namespace LineChartMulti {
  export interface Props {
    data: UI.Coord[][];
    width?: number;
    height?: number;
    graphAxis?: UI.GraphAxis[];
    showSlider?: boolean;
  }
  export interface State {
    sliderValues: number[];
  }
}

const colorCodes = ['green', 'blue', 'grey', 'purple', 'red', 'pink', 'yellow'];

const commonAxisConfig = {
  hideInLegendAndTooltip: true,
  lineTension: 0,
  steppedLine: true,
  borderWidth: 1,
  pointRadius: 0,
  fill: false,
  backgroundColor: 'rgba(0,0,0,0)'
};

const pointAxisConfig = {
  pointRadius: 5,
  pointHoverRadius: 8,
  pointStyle: 'crossRot' as any,
  showLine: false // no line shown
};

export class LineChartMulti extends React.Component<LineChartMulti.Props, LineChartMulti.State> {
  state = {
    sliderValues: [0, 100]
  };
  getChartData() {
    const { data, graphAxis = [] } = this.props;
    const firstDate = _.min(_.compact(_.map(data, (dataset) => _.get(dataset, '[0].x', null))))!;
    const lastDate = _.max(
      _.compact(_.map(data, (dataset) => (_.last(dataset) ? _.last(dataset)!.x : 0)))
    )!;
    const dateRangeMs = lastDate - firstDate;
    const startDate = Math.round(firstDate + (this.state.sliderValues[0] / 100) * dateRangeMs);
    const endDate = Math.round(firstDate + (this.state.sliderValues[1] / 100) * dateRangeMs);

    // each row is an array, with x, y1, y2
    const datasets: ChartDataSets[] = _.map(data, (dataset, i) => {
      return _.merge(
        {},
        commonAxisConfig,
        {
          data: dataset.filter((d) => d.x > startDate && d.x < endDate),
          label: (graphAxis[i] && graphAxis[i].label) || `col${i + 1}`,
          borderColor: graphAxis[i].color || colorCodes[i],
          yAxisID: (graphAxis[i] && graphAxis[i].id) || `axis${i + 1}`
        },
        graphAxis[i].pointStyle ? { ...pointAxisConfig, pointStyle: graphAxis[i].pointStyle } : {}
      );
    });
    const chartData = (canvas: HTMLElement) => {
      return {
        datasets
      };
    };
    // console.log(`LineChartMulti data`, datasets);
    return chartData;
  }

  getChartOptions(): ChartOptions {
    const { graphAxis = [], data } = this.props;

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
            yAxes.length % 2 === 0 ? 'right' : 'left',
            graphAxis[datasetIndex].color || colorCodes[datasetIndex],
            graphAxis[datasetIndex].gridLines
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
        yAxes,
        xAxes: [
          {
            display: true,
            gridLines: { display: true },
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
          }
        ]
      }
    };
  }

  handleRangeChange = (_e: React.ChangeEvent<{}>, sliderValues: number[]) => {
    this.setState({ sliderValues });
  };

  render() {
    const { data, width = 2000, height = 800, showSlider } = this.props;
    if (data.length == 0) return null;
    return (
      <div>
        <Line
          redraw
          options={this.getChartOptions()}
          width={width}
          height={height}
          data={this.getChartData()}
        />
        {showSlider && (
          <div style={{ margin: '0 20px 0 20px' }}>
            <Slider
              value={this.state.sliderValues}
              onChange={this.handleRangeChange as any}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              getAriaValueText={() => {
                return 'arial';
              }}
            />
          </div>
        )}
      </div>
    );
  }
}
