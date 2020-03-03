import { shallow } from 'enzyme';
import React from 'react';
import App from '../pages';

describe('With Enzyme', () => {
  it('App shows', () => {
    const app = shallow(<App />);
     // mount(<App />) 太麻烦 canvas 安装
    expect(app.find('p').text()).toEqual('猜卟透の兲氣，卟知菏時熋兲ㄖ青');
  });
});
