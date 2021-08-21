import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { select, text, withKnobs } from '@storybook/addon-knobs';
import { Section } from '../../Storybook';
import { LinkButton } from '../LinkButton';

storiesOf('LinkButton', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const label = text('Label', 'Button Label');
    const btnSize = select('Size', ['sm', 'md', 'lg'], 'md') as UI.SizeSML;

    return (
      <Section title="AddButton" description="Basic Add Button" centered>
        <LinkButton
          theme={
            select(
              'theme',
              ['primary', 'primaryInvertedUnderline', 'secondary'],
              'primary'
            ) as LinkButton.Theme
          }
          label={label}
          btnSize={btnSize}
        />
      </Section>
    );
  });
