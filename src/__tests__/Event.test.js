// src/__test__s__/Event.test.js
import React from 'react';
import { render } from '@testing-library/react';
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

  test('renders the event start time from .created', () => {
    expect(EventComponent.queryByText(event.created)).toBeInTheDocument();
  });

  test('renders the event location from .location', () => {
    expect(EventComponent.queryByText(event.location)).toBeInTheDocument();
  });

  test('renders a "show details" button', () => {
    const button = EventComponent.getByRole('button', { name: 'show details' });
    expect(button).toBeInTheDocument();
  });

  test('toggles event details when button is clicked', () => {
    const button = EventComponent.getByRole('button', {
      name: /show details/i,
    });

    //Details hidden by default
    expect(
      EventComponent.queryByText(event.description)
    ).not.toBeIntheDocument();

    //Expand details
    button.click();
    expect(EventComponent.getByText(event.description)).toBeIntheDocument();

    //Collapse again
    button.click();
    expect(
      EventComponent.queryByText(event.description)
    ).not.toBeIntheDocument();
  });
});
