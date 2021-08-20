import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Section } from '../../Storybook';
import { CustomInputs } from '../CustomInputs';

storiesOf('CustomInputs', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const props: CustomInputs.Props = {
      inputs: [
        {
          name: 'name',
          label: 'name',
          type: 'TextInput'
        },
        {
          name: 'phone',
          label: 'phone',
          type: 'TextInput'
        }
      ]
    };
    return (
      <Section title="CustomInputs" description="<DESCRIPTION_HERE>" centered>
        <div>
          <CustomInputs {...props} />
        </div>
      </Section>
    );
  });
