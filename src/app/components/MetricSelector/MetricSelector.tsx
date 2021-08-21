import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import Select from 'react-select';

const styles = StyleSheet.create({
  metricSelectorWrapper: {
    maxWidth: 600
  }
});

export namespace MetricSelector {
  export interface Option {
    title: string;
  }
  export interface Props {
    options: Option[];
    selectedIndex: number;
    onChange: (index: number) => void;
  }
  export interface State {}

  export interface SelectOption {
    label: string;
    value: string;
    index: number;
  }
}

export class MetricSelector extends React.PureComponent<
  MetricSelector.Props,
  MetricSelector.State
> {
  _onChange = (value?: MetricSelector.SelectOption | null) => {
    if (value) {
      this.props.onChange(value.index);
    }
  };

  render() {
    const { selectedIndex, options } = this.props;
    const selectOptions = _.map(options, (o, i) => ({ label: o.title, value: o.title, index: i }));
    return (
      <div className={css(styles.metricSelectorWrapper)}>
        <Select
          options={selectOptions}
          onChange={this._onChange as any}
          value={selectOptions[selectedIndex]}
        />
      </div>
    );
  }
}
