import { css, StyleSheet } from 'aphrodite';
import * as React from 'react';
import * as _ from 'lodash';
import { Field, FieldArray } from 'redux-form';
import { required } from '@utils/formValidator';
import { DropDownInputAdapter } from '@components/DropDownInputAdapter/DropDownInputAdapter';
import { CheckboxInputAdapter } from '@components/CheckboxInputAdapter/CheckboxInputAdapter';

const styles = StyleSheet.create({
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 10
  },
  inputStyle: {
    minWidth: 250,
    padding: 10,
    width: '100%'
  },
  repeatedSectionWrapper: {
    background: '#f1f1f1',
    border: '1px solid #dddddd',
    marginBottom: 10
  },
  mainFormWrapper: {
    width: '100%',
    maxWidth: 600,
    display: 'inline-block'
  },
  fieldRowWrapper: {
    width: '50%',
    display: 'inline-block'
  },
  fieldWrapper: {
    //width: '100%',
    display: 'inline-block'
  },
  fieldWrapperFull: {
    width: '100%'
  }
});

export const renderField = ({
  input,
  label,
  type,
  isFull,
  title,
  meta: { touched, error, warning }
}: any) => (
  <div className={css(styles.fieldWrapper, isFull && styles.fieldWrapperFull)}>
    <label>{label}</label>
    <div>
      <input className={css(styles.inputStyle)} {...input} type={type} />
      {touched &&
        ((error && <span className={css(styles.error)}>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

export const renderTextAreaField = ({
  input,
  label,
  type,
  isFull,
  title,
  rows,
  meta: { touched, error, warning }
}: any) => {
  return (
    <div className={css(styles.fieldWrapper, isFull && styles.fieldWrapperFull)}>
      <label>{label}</label>
      <div>
        <textarea className={css(styles.inputStyle)} {...input} rows={rows || 3} />
        {touched &&
          ((error && <span className={css(styles.error)}>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};

export const renderDropdownField = ({
  input,
  label,
  type,
  title,
  options,
  meta: { touched, error, warning }
}: any) => {
  return (
    <div className={css(styles.fieldWrapper)}>
      <div>
        <label htmlFor={input.name}>{label}</label>
      </div>
      <div>
        <DropDownInputAdapter {...input} options={options} />
        {touched &&
          ((error && <span className={css(styles.error)}>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};
export const renderCheckboxField = ({
  input,
  label,
  type,
  title,
  options,
  meta: { touched, error, warning }
}: any) => {
  return (
    <div className={css(styles.fieldWrapper)}>
      <div className={css(styles.fieldWrapper)}>
        <CheckboxInputAdapter {...input} name={input.name} />{' '}
        <label htmlFor={input.name}>{label}</label>
      </div>
      <div>
        {touched &&
          ((error && <span className={css(styles.error)}>{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};
export const renderArray = ({ fields, title, baseSection, meta: { error } }: any) => (
  <div>
    <div>
      {fields.map((field: any, index: number) => (
        <div key={index} className={css(styles.repeatedSectionWrapper)}>
          <div>
            {title} #{index} <button onClick={() => fields.remove(index)}>-Delete</button>
          </div>
          {_.map(baseSection, (conf: FormFormat.FormParam, index: number) => {
            return (
              <Field
                key={index}
                name={`${field}.${conf.name}`}
                label={conf.displayName || conf.name}
                title={conf.description}
                component={renderField}
                type={conf.type}
                placeholder={conf.placeholder}
                validate={_.compact([conf.required ? required : null])}
              />
            );
          })}
        </div>
      ))}
    </div>
    <div>
      <button type="button" onClick={() => fields.push()}>
        +Add
      </button>
    </div>
  </div>
);

export function renderFormFields(formConfig: FormFormat.FormParam[]) {
  const allFields = _.map(formConfig, (conf) => {
    if (conf.baseSection) {
      return (
        <div key={conf.name}>
          <label>{conf.name}</label>
          <FieldArray
            name={conf.name}
            component={renderArray}
            baseSection={conf.baseSection}
            title={conf.displayName || conf.name}
          />
        </div>
      );
    }
    if (conf.type === 'select') {
      return (
        <div key={conf.name}>
          <Field
            name={conf.name}
            component={renderDropdownField}
            options={conf.options}
            title={conf.displayName || conf.name}
          />
        </div>
      );
    } else if (conf.type === 'checkbox') {
      return (
        <div key={conf.name}>
          <Field
            name={conf.name}
            component={renderCheckboxField}
            label={conf.displayName || conf.name}
          />
        </div>
      );
    } else if (conf.type === 'textarea') {
      return (
        <div key={conf.name}>
          <Field
            name={conf.name}
            label={conf.displayName || conf.name}
            title={conf.description}
            rows={conf.rows}
            component={renderTextAreaField}
            isFull={conf.isFull}
            options={conf.options}
            placeholder={conf.placeholder}
            validate={_.compact([conf.required ? required : null])}
          />
        </div>
      );
    }
    return (
      <div
        key={conf.name}
        className={css(styles.fieldRowWrapper, conf.isFull && styles.fieldWrapperFull)}
      >
        <Field
          name={conf.name}
          label={conf.displayName || conf.name}
          title={conf.description}
          component={renderField}
          isFull={conf.isFull}
          type={conf.type}
          placeholder={conf.placeholder}
          validate={_.compact([conf.required ? required : null])}
        />
      </div>
    );
  });
  return <div className={css(styles.mainFormWrapper)}>{allFields}</div>;
}
