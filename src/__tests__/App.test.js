// src/__tests__/App.test.js
import { render } from '@testing-library/react';
import React from 'react';
import App from './../App';

describe('<App /> component', () => {
  let AppDOM;
  beforeEach(() => {
    AppDOM = render(<App />).container.firstChild;
  });

  test('renders list of events', () => {
    expect(AppDOM.querySelector('#event-list')).toBeInTheDocument();
  });

  test('render CitySearch', () => {
    expect(AppDOM.querySelector('#city-search')).toBeInTheDocument();
  });

  test('renders NumberOfEvents component', () => {
    const { container } = render(<App />);
    expect(
      container.firstChild.querySelector('#number-of-events')
    ).toBeInTheDocument();
  });
});
