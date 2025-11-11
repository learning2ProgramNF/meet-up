// src/__test__s__/Event.test.js
import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from '../components/Event';
import mockData from '../mock-data';
import { getEvents } from '../api';

describe('<Event /> component', () => {
  let EventComponent;
  let event;

  beforeEach(async () => {
    const allEvents = await getEvents();
    event = allEvents[0];
    EventComponent = render(<Event event={event} />);
  });

  test('renders the event title from .summary', () => {
    expect(EventComponent.queryByText(event.summary)).toBeInTheDocument();
  });

  test('renders the event start time from .start.dateTime', () => {
    expect(
      EventComponent.queryByText(event.start.dateTime)
    ).toBeInTheDocument();
  });

  test('renders the event location from .location', () => {
    expect(EventComponent.queryByText(event.location)).toBeInTheDocument();
  });

  test('renders a "show details" button', () => {
    const button = EventComponent.getByRole('button', { name: 'show details' });
    expect(button).toBeInTheDocument();
  });

  test('toggles event details when button is clicked', async () => {
    const user = userEvent.setup();
    const button = EventComponent.getByRole('button', {
      name: /show details/i,
    });

    //Details hidden by default
    expect(
      EventComponent.queryByText(event.description)
    ).not.toBeInTheDocument();

    //Expand details
    await user.click(button);
    expect(
      EventComponent.getByText(/Have you wondered how you can ask Google/i)
    ).toBeInTheDocument();

    //Collapse again
    await user.click(button);
    expect(
      EventComponent.queryByText(event.description)
    ).not.toBeInTheDocument();
  });
});
