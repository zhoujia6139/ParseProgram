import * as React from 'react';
import * as _ from 'lodash';
import { css, StyleSheet } from 'aphrodite';
import { Layout } from '@containers/Layout';
import { fetchTextMetricOptions, submitTextMetric } from '@utils/apiUtils';
import { Header, ParamsForm, MetricSelector, AnyChart, TableView } from '@components/index';

const styles = StyleSheet.create({
  textMetricWrapper: {
    padding: '0 20px'
  }
});

export namespace TextMetric {
  export interface Props {}
  export interface State {
    paramsFormOptions: FormFormat.SelectionOption[];
    selectedIndex: number;
    results: any[];
  }
}

function splitResults(results: any[]) {
  const [chartData, restData] = _.partition(results, (r) => !!r.chartData);
  const [tableData, textData] = _.partition(restData, (r) => !!r.tableData);
  return { chartData, textData, tableData };
}

export class TextMetric extends React.PureComponent<TextMetric.Props, TextMetric.State> {
  state = {
    paramsFormOptions: [] as FormFormat.SelectionOption[],
    selectedIndex: 0,
    results: []
  };

  async componentDidMount() {
    const response = await fetchTextMetricOptions();
    this.setState({ paramsFormOptions: response.data });
  }

  onSelectionChange = (index: number) => {
    this.setState({ selectedIndex: index });
  };

  onSubmit = async (values: Record<string, any>) => {
    this.setState({ results: ['Loading...'] });
    const methodName = this.state.paramsFormOptions[this.state.selectedIndex].title;
    const response = await submitTextMetric({ methodName, values });
    this.setState({ results: response.data });
  };

  renderCharts(chartDataArr: UI.GraphData[]) {
    if (_.isEmpty(chartDataArr)) return null;
    return _.map(chartDataArr, (chartData, i) => {
      return (
        <AnyChart
          chartType={chartData.chartType || 'lineMulti'}
          isTimeAxis={chartData.isTimeAxis}
          key={i}
          data={chartData.chartData}
          graphAxis={chartData.graphAxis}
          showSlider={true}
        />
      );
    });
  }

  render() {
    const { paramsFormOptions, selectedIndex, results } = this.state;
    const { chartData, textData, tableData } = splitResults(results);
    // console.log(`====chartData textData`, chartData, textData);
    return (
      <Layout>
        <div className={css(styles.textMetricWrapper)}>
          <Header text="Text Metric" />
          <div>
            <MetricSelector
              onChange={this.onSelectionChange}
              selectedIndex={selectedIndex}
              options={paramsFormOptions}
            />
            {!_.isEmpty(paramsFormOptions) && (
              <ParamsForm
                onSubmit={this.onSubmit}
                formId={selectedIndex}
                formConfig={
                  paramsFormOptions[selectedIndex] ? paramsFormOptions[selectedIndex].params : []
                }
              />
            )}
            <div>{this.renderCharts(chartData)}</div>
            <div>
              {_.map(tableData, (t) => (
                <TableView data={t.tableData as any} />
              ))}
            </div>
            <div>
              <pre>{JSON.stringify(textData, null, 4)}</pre>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
