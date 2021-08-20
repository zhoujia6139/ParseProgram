import { componentTestUtils } from '@testUtils/index';
import { BrandLogo } from '../BrandLogo';

describe('BrandLogo', () => {
  const props: BrandLogo.Props = {
    src: './a.png'
  };

  componentTestUtils.shallowSnapshotTest<BrandLogo.Props>(BrandLogo, props, 'renders');
});
