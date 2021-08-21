import * as _ from 'lodash';
import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import Dropdown from 'react-bootstrap/Dropdown';
import autobind from 'autobind-decorator';

const styles = StyleSheet.create({
  dropDownInputAdapterWrapper: {}
});

export namespace DropDownInputAdapter {
  export interface Props {
    options: FormFormat.SelectOption[];
    onChange: (val: any) => any;
  }
  export interface State {
    currentIndex: number;
  }
}

export class DropDownInputAdapter extends React.PureComponent<
  DropDownInputAdapter.Props,
  DropDownInputAdapter.State
> {
  state = {
    currentIndex: 0
  };

  protected changeIndex(index: number) {
    this.setState({ currentIndex: index });
    const { options, onChange } = this.props;
    onChange(options[index] && options[index].value);
  }

  componentDidMount() {
    const { options, onChange } = this.props;
    // fire initial value
    onChange(options[this.state.currentIndex] && options[this.state.currentIndex].value);
  }

  @autobind
  protected onSelect(e: React.SyntheticEvent<any>) {
    const index = parseInt((e.target as any).getAttribute('index')) || 0;
    this.changeIndex(index);
  }

  componentWillReceiveProps(
    nextProps: Readonly<DropDownInputAdapter.Props>,
    nextContext: any
  ): void {
    if (!_.isEqual(nextProps.options, this.props.options)) {
      // reset index if options changed
      this.changeIndex(0);
    }
  }

  render() {
    const { options } = this.props;
    return (
      <div className={css(styles.dropDownInputAdapterWrapper)}>
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            {options[this.state.currentIndex] && options[this.state.currentIndex].label}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {_.map(options, (option, index) => {
              return (
                <Dropdown.Item key={index} onClick={this.onSelect} index={index}>
                  {option.label}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}
