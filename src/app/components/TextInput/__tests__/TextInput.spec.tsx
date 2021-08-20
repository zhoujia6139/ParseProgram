import { componentTestUtils } from '@testUtils/index';
import { TextInput } from '../TextInput';

describe('TextInput', () => {
  const props: TextInput.Props = {
    name: 'a'
  };

  componentTestUtils.shallowSnapshotTest<TextInput.Props>(TextInput, props, 'renders');
});
