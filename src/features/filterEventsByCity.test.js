import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getEvents } from '../api';

const feature = loadFeature('./src/features/filterEventsByCity.feature');

defineFeature(feature, (test) => {
  let AppComponent;
  let CitySearchDOM;
  let AppDOM;
  let citySearchInput;
  let suggestionListItems;

  // SCENARIO 1
  test("When user hasn't searched for a city, show upcoming events from all cities.", ({
    given,
    when,
    then,
  }) => {
    given("user hasn't searched for any city", () => {
      // Empty - nothing to set up
    });

    when('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    then('the user should see the list of all upcoming events.', async () => {
      const AppDOM = AppComponent.container.firstChild;
      const EventListDOM = AppDOM.querySelector('#event-list');

      await waitFor(() => {
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        expect(EventListItems.length).toBe(32);
      });
    });
  });

  // SCENARIO 2
  test('User should see a list of suggestions when they search for a city.', ({
    given,
    when,
    then,
  }) => {
    given('the main page is open', () => {
      AppComponent = render(<App />);
    });

    when('user starts typing in the city textbox', async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector('#city-search');
      const citySearchInput = within(CitySearchDOM).queryByRole('textbox');
      await user.type(citySearchInput, 'Berlin');
    });

    then(
      "the user should receive a list of cities (suggestions) that match what they've typed",
      () => {
        const suggestionListItems =
          within(CitySearchDOM).queryAllByRole('listitem');
        expect(suggestionListItems).toHaveLength(2);
      }
    );
  });

  // SCENARIO 3
  test('User can select a city from the suggested list.', ({
    given,
    and,
    when,
    then,
  }) => {
    given(/^user was typing "(.*)" in the city textbox$/, async (arg0) => {
      AppComponent = render(<App />);
      const user = userEvent.setup();
      AppDOM = AppComponent.container.firstChild;
      CitySearchDOM = AppDOM.querySelector('#city-search');
      citySearchInput = within(CitySearchDOM).queryByRole('textbox');
      await user.type(citySearchInput, arg0);
    });

    and('the list of suggested cities is showing', () => {
      suggestionListItems = within(CitySearchDOM).queryAllByRole('listitem');
      expect(suggestionListItems).toHaveLength(2);
    });

    when(
      /^the user selects a city \(e.g., "(.*)"\) from the list$/,
      async (arg0) => {
        const user = userEvent.setup();
        await user.click(suggestionListItems[0]);
      }
    );

    then(
      /^their city should be changed to that city \(i.e., "(.*)"\)$/,
      (arg0) => {
        expect(citySearchInput.value).toBe(arg0);
      }
    );

    and(
      'the user should receive a list of upcoming events in that city',
      async () => {
        const EventListDOM = AppDOM.querySelector('#event-list');
        const EventListItems = within(EventListDOM).queryAllByRole('listitem');
        const allEvents = await getEvents();

        const berlinEvents = allEvents.filter(
          (event) => event.location === citySearchInput.value
        );
        expect(EventListItems).toHaveLength(berlinEvents.length);
      }
    );
  });
});
