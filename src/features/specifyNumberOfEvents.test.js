import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/specifyNumberOfEvents.feature');

defineFeature(feature, (test) => {
  let AppComponent;

  // SCENARIO 1
  test("When user hasn't specified a number, 32 events are shown by default", ({
    given,
    when,
    then,
  }) => {
    given('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    when('the user views the event list', async () => {
      const AppDOM = AppComponent.container.firstChild;
      await waitFor(() => {
        const eventList = within(AppDOM).queryAllByRole('listitem');
        expect(eventList.length).toBeGreaterThan(0);
      });
    });

    then(/^(\d+) events should be displayed by default$/, async (arg0) => {
      const AppDOM = AppComponent.container.firstChild;
      await waitFor(() => {
        const eventList = within(AppDOM).queryAllByRole('listitem');
        expect(eventList.length).toBe(parseInt(arg0));
      });
    });
  });

  // SCENARIO 2
  test('User can change the number of events displayed', ({
    given,
    when,
    then,
  }) => {
    given('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    when(/^the user changes the number of events to (\d+)$/, async (arg0) => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      const NumberOfEventsDOM = AppDOM.querySelector('#number-of-events');
      const numberInput = within(NumberOfEventsDOM).queryByRole('textbox');

      await user.clear(numberInput);
      await user.type(numberInput, arg0);
    });

    then(/^(\d+) events should be displayed$/, async (arg0) => {
      const AppDOM = AppComponent.container.firstChild;
      await waitFor(() => {
        const eventList = within(AppDOM).queryAllByRole('listitem');
        expect(eventList.length).toBe(parseInt(arg0));
      });
    });
  });
});
