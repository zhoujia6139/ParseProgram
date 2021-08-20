import { componentTestUtils } from '@testUtils/index';
import { BodyWrapper } from '../BodyWrapper';

describe('BodyWrapper', () => {
  const props: BodyWrapper.Props = {};

  componentTestUtils.shallowSnapshotTest<BodyWrapper.Props>(BodyWrapper, props, 'renders');
});
