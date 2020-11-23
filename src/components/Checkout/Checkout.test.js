import * as React from 'react';
import Table from 'react-bootstrap/Table';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import Checkout from './Checkout';
import { basketTotalMock } from './Checkout.test.mock';

configure({ adapter: new Adapter() });

describe('<Checkout basketTotal={basketTotal} />', () => {

  it('should render table', () => {
    const wrapper = shallow(<Checkout />);
    expect(wrapper.find(<Table />)).toBeTruthy();
  });

  it('should render empty table when empty array is provided', () => {
    const wrapper = shallow(<Checkout basketTotal={[]} />);
    expect(wrapper.find('tbody tr').length).toBe(0);
  });

  it('should render the same amount of rows as the size of the array provided in basketTotal', () => {
    const wrapper = shallow(<Checkout basketTotal={basketTotalMock} />);
    expect(wrapper.find(<Table />)).toBeTruthy();
    expect(wrapper.find('tbody tr').length).toBe(basketTotalMock.length);
  });

  it('should render 4 columns per row', () => {
    const wrapper = shallow(<Checkout basketTotal={[basketTotalMock[0]]} />);
    expect(wrapper.find('tbody > tr > td').length).toBe(4);
  });

  it('should fill the first column correctly', () => {
    const basketTotal = basketTotalMock[0];
    const wrapper = shallow(<Checkout basketTotal={[basketTotal]} />);
    const text = wrapper.find('tbody > tr > td:first-child').text();
    expect(text).toBe(`${basketTotal.amount}x ${basketTotal.name}`);
  });

});