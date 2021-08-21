import * as React from 'react';

export namespace CheckboxInputAdapter {
  export interface Props {
    name: string;
    onChange: (val: any) => any;
  }
  export interface State {
    checked: boolean;
  }
}

export class CheckboxInputAdapter extends React.PureComponent<
  CheckboxInputAdapter.Props,
  CheckboxInputAdapter.State
> {
  state = {
    checked: false
  };

  toggle = () => {
    const newVal = !this.state.checked;
    this.setState({ checked: newVal });
    this.props.onChange(newVal);
  };

  render() {
    return (
      <input
        type="checkbox"
        checked={this.state.checked}
        name={this.props.name}
        onClick={this.toggle}
      />
    );
  }
}
