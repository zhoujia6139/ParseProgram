import * as React from 'react';
import { LineChartMulti } from '../LineChartMulti/LineChartMulti';
import { ScatterChart } from '../ScatterChart/ScatterChart';

export namespace AnyChart {
  export interface Props {
    data: UI.Coord[][];
    width?: number;
    height?: number;
    graphAxis?: UI.GraphAxis[];
    chartType: UI.GraphData['chartType'];
    isTimeAxis?: boolean;
    showSlider?: boolean;
  }
  export interface State {}
}

export class AnyChart extends React.PureComponent<AnyChart.Props, AnyChart.State> {
  render() {
    const { chartType, data, graphAxis, isTimeAxis, showSlider } = this.props;
    if (chartType === 'scatter') {
      return <ScatterChart data={data} graphAxis={graphAxis} isTimeAxis={isTimeAxis} />;
    } else if (chartType === 'lineMulti') {
      return <LineChartMulti data={data} graphAxis={graphAxis} showSlider={showSlider} />;
    }
    return null;
  }
}
