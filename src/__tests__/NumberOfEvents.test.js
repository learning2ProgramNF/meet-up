import { render } from '@testing-library/react';
import React from 'react';
import userEvent from '@testing-library/user-event';
import NumberOfEvents from '../components/NumberOfEvents';

describe('<NumberOfEvents /> component', () => {
  test('renders an input textbox', () => {
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('textbox');
    expect(input).toBeInTheDocument();
  });

  test('default value on top is 32', () => {
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('textbox');
    expect(input.value).toBe('32');
  });

  test('input value changes when user types', async () => {
    const user = userEvent.setup();
    const { getByRole } = render(<NumberOfEvents />);
    const input = getByRole('textbox');

    await user.type(input, '{backspace}{backspace}10');
    expect(input.value).toBe('10');
  });

  test('component has the correct id wrapper', () => {
    const { container } = render(<NumberOfEvents />);
    expect(container.querySelector('#number-of-events')).toBeInTheDocument();
  });
});
