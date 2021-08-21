import * as _ from 'lodash';
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs } from '@storybook/addon-knobs';
import { Section } from '../../Storybook';
import { BrandLogo } from '../BrandLogo';

storiesOf('BrandLogo', module)
  .addDecorator(withKnobs)
  .add('Default', () => {
    const props: BrandLogo.Props = {
      src: './'
    };
    return (
      <Section title="BrandLogo" description="<DESCRIPTION_HERE>" centered>
        <BrandLogo {...props} />
      </Section>
    );
  });
