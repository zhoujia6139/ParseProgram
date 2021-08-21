import * as _ from 'lodash';
import * as React from 'react';

export namespace TextInput {
  export interface Props {
    name: string;
    defaultValue?: string;
    onValueChange?: (prop: { name: string; value: string }) => any;
  }
  export interface State {
    value: string;
  }
}

export class TextInput extends React.PureComponent<TextInput.Props, TextInput.State> {
  constructor(props: TextInput.Props) {
    super(props);
    this.state = {
      value: props.defaultValue || ''
    };
  }

  onChange = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const { onValueChange, name } = this.props;
    const value = (e.target as any).value;
    this.setState({ value });
    onValueChange && onValueChange({ name, value });
  };

  render() {
    const { name } = this.props;
    return <input name={name} value={this.state.value} onChange={this.onChange} />;
  }
}
