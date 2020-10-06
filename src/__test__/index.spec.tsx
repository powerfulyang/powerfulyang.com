import { render } from 'enzyme';
import React from 'react';
import Index from '../../pages';
import Panel from '../../pages/panel';

describe('With Enzyme', () => {
  it('Index shows', () => {
    const index = render(<Index />);
    expect(index.find('p').text()).toEqual('猜不透的天气, 不知何时能天晴');
  });

  it('Panel shows', () => {
    const panel = render(<Panel />);
    expect(panel.find('a').first().text()).toEqual('home');
  });
});
