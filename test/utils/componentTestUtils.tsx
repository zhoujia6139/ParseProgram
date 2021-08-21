import * as React from 'react';
import { shallow as EnzymeShallow, ShallowWrapper } from 'enzyme';

export function shallow(component: React.ReactElement<any>, context?: any): ShallowWrapper<any, any> {
  return EnzymeShallow(component, { lifecycleExperimental: true, context });
}
export function shallowSnapshotTest<T = {}>(
  ComponentToTest: React.ComponentClass<T>,
  props: T = {} as T,
  descriptionText = 'renders',
) {
  it(descriptionText, () => {
    const wrapper = shallow(<ComponentToTest {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
}
