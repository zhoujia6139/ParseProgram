import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { text, withKnobs } from '@storybook/addon-knobs';
import { Section } from '../../Storybook';
import { BodyWrapper } from '../BodyWrapper';

storiesOf('BodyWrapper', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    return (
      <Section title="BodyWrapper" description="<DESCRIPTION_HERE>" centered>
        <BodyWrapper>{text('content', 'Sample Content')}</BodyWrapper>
      </Section>
    );
  });
