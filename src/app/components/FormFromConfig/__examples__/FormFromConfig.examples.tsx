import * as _ from 'lodash';
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Section } from '../../Storybook';
import { FormFromConfig } from '../FormFromConfig';

storiesOf('FormFromConfig', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const props: FormFromConfig.Props = {
      config: [
        {
          name: 'startDate',
          defaultValue: '2019-01-01'
        },
        {
          name: 'endDate',
          defaultValue: '2019-01-02'
        }
      ],
      onSubmit: (formValues) => {
        console.log(`submit formValues`, formValues);
      }
    };
    return (
      <Section title="FormFromConfig" description="<DESCRIPTION_HERE>" centered>
        <FormFromConfig {...props} />
      </Section>
    );
  });
