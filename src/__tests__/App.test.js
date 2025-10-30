// src/__tests__/App.test.js
import React from 'react';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { getEvents } from '../api';
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

describe('<App /> integration', () => {
  test('renders a list of events matching the city selected by the user', async () => {
    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    const CitySearchDOM = AppDOM.querySelector('#city-search');
    const CitySearchInput = within(CitySearchDOM).queryByRole('textbox');

    await user.type(CitySearchInput, 'Berlin');

    const berlinSuggestionItem =
      within(CitySearchDOM).getByText('Berlin, Germany');

    await user.click(berlinSuggestionItem);

    const allRenderedEventItems = AppDOM.querySelectorAll('#event-list li');

    const allEvents = await getEvents();
    const berlinEvents = allEvents.filter(
      (event) => event.location === 'Berlin, Germany'
    );

    expect(allRenderedEventItems.length).toBe(berlinEvents.length);

    allRenderedEventItems.forEach((event) => {
      expect(event.textContent).toContain('Berlin, Germany');
    });
  });

  test('user can change the number of events displayed', async () => {
    const user = userEvent.setup();
    const AppComponent = render(<App />);
    const AppDOM = AppComponent.container.firstChild;

    //Get the NumberOFEvents input field
    const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
    const NumberOfEventsInput = within(NumberOfEventsDOM).getByRole('textbox');

    //Change the inpute value from default 32 to 10
    await user.type(NumberOfEventsInput, '{backspace}{backspace}10');

    //Get the EventList component
    const EventListDOM = AppDOM.querySelector('#event-list');

    //Wait for the events to be rendered with the new number
    await waitFor(() => {
      const EventListItems = within(EventListDOM).getAllByRole('listitem');
      expect(EventListItems.length).toBe(10);
    });
  });
});
