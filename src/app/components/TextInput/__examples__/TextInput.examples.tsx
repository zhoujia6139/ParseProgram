import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Section } from '../../Storybook';
import { TextInput } from '../TextInput';

storiesOf('TextInput', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const props: TextInput.Props = {
      name: 'name',
      defaultValue: 'default value'
    };
    return (
      <Section title="TextInput" description="<DESCRIPTION_HERE>" centered>
        <TextInput {...props} />
      </Section>
    );
  });
