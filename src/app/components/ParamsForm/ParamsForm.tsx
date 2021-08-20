import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';
import { reduxForm, InjectedFormProps } from 'redux-form';
import { getFormInitValues } from '@utils//formUtils';
import { renderFormFields } from '@utils/formFieldRenderer';
import * as _ from 'lodash';
import Button from 'react-bootstrap/Button';

const styles = StyleSheet.create({
  paramsFormWrapper: {
    padding: 20
  },
  repeatedSectionWrapper: {
    background: '#f1f1f1',
    border: '1px solid #dddddd',
    marginBottom: 10
  }
});

export namespace ParamsForm {
  export interface Props {
    formId: string | number; // if form id change, re-init form default values
    formConfig: FormFormat.FormParam[];
    overrideInitialValues?: any;
    onSubmit: (values: Record<string, any>) => any;
  }
  export interface State {}
}

export class ParamsFormClass extends React.PureComponent<
  InjectedFormProps<any> & ParamsForm.Props,
  ParamsForm.State
> {
  componentWillReceiveProps(
    nextProps: Readonly<InjectedFormProps<any> & ParamsForm.Props>,
    nextContext: any
  ): void {
    if (nextProps.formId !== this.props.formId) {
      this.initForm(nextProps);
    }
  }

  componentDidMount(): void {
    this.initForm(this.props);
  }

  initForm(nextProps: Readonly<InjectedFormProps<any> & ParamsForm.Props>) {
    // console.log(`====this.props.formConfig`, nextProps.formConfig);
    const initValues = getFormInitValues(nextProps.formConfig);
    console.log(`====initValues`, nextProps.overrideInitialValues);
    this.props.initialize(_.extend(initValues, nextProps.overrideInitialValues));
  }

  render() {
    const { formConfig, handleSubmit } = this.props;
    return (
      <div className={css(styles.paramsFormWrapper)}>
        <div>
          <h2>Set Params</h2>
        </div>
        {renderFormFields(formConfig)}
        <div>
          <br />
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    );
  }
}

export const ParamsForm = reduxForm<any, any>({
  form: 'ParamsForm', // a unique identifier for this form
  onSubmit: (_values: any) => {}
})(ParamsFormClass);
