import { render } from 'enzyme';
import React from 'react';
import Index from '../../pages';

describe('With Enzyme', () => {
  it('Index shows', () => {
    const index = render(<Index />);
    expect(index.find('p').text()).toEqual('猜不透的天气, 不知何时能天晴');
  });
});
