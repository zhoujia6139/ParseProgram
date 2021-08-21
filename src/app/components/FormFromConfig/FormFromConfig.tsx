import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { TextInput } from '../TextInput/TextInput';

const styles = StyleSheet.create({
  formFromConfigWrapper: {},
  label: {
    paddingRight: 4
  }
});

export namespace FormFromConfig {
  export interface Props {
    config: FieldConfig[];
    onSubmit?: (formValues: Record<string, string>) => any;
  }
  export interface FieldConfig {
    name: string;
    defaultValue?: string;
  }
  export interface State {}
}

export class FormFromConfig extends React.Component<FormFromConfig.Props, FormFromConfig.State> {
  formValues: Record<string, string> = {};
  constructor(props: FormFromConfig.Props) {
    super(props);
    _.each(props.config, (config) => {
      if (config.defaultValue) {
        this.formValues[config.name] = config.defaultValue;
      }
    });
  }

  onValueChange = (data: { name: string; value: string }) => {
    const { name, value } = data;
    this.formValues[name] = value;
  };

  renderOneField(config: FormFromConfig.FieldConfig) {
    return (
      <div key={config.name}>
        <label htmlFor={config.name} className={css(styles.label)}>
          {config.name}
        </label>
        <TextInput
          name={config.name}
          defaultValue={config.defaultValue}
          onValueChange={this.onValueChange}
        />
      </div>
    );
  }

  renderSubmit() {
    const { onSubmit } = this.props;
    if (!onSubmit) {
      return null;
    }

    return <button onClick={() => onSubmit(this.formValues)}>Submit</button>;
  }

  render() {
    const { config } = this.props;
    return (
      <div className={css(styles.formFromConfigWrapper)}>
        {_.map(config, (conf) => this.renderOneField(conf))}
        {this.renderSubmit()}
      </div>
    );
  }
}
