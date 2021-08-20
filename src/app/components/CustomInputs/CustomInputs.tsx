import * as _ from 'lodash';
import * as React from 'react';
import * as inputUtils from '@utils/inputUtils';
import { css, StyleSheet } from 'aphrodite';

const styles = StyleSheet.create({
  customInputsWrapper: {},
  singleInputsWrapper: {
    padding: 8
  },
  labelWrapper: {
    textAlign: 'right'
  },
  label: {
    marginRight: 10
  }
});

export namespace CustomInputs {
  export interface InputConfig {
    name: string;
    label: string;
    type: UI.InputType;
  }
  export interface Props {
    inputs: InputConfig[];
  }
  export interface State {}
}

export class CustomInputs extends React.PureComponent<CustomInputs.Props, CustomInputs.State> {
  render() {
    const { inputs } = this.props;
    return (
      <table className={css(styles.customInputsWrapper)}>
        <tbody>
          {_.map(inputs, (input) => {
            return (
              <tr className={css(styles.singleInputsWrapper)}>
                <td className={css(styles.labelWrapper)}>
                  <label className={css(styles.label)}>{input.label}</label>
                </td>
                <td>{inputUtils.getInputFromType(input.type, { name: input.name })}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}
