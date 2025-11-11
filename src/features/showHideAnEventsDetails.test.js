import React from 'react';
import { loadFeature, defineFeature } from 'jest-cucumber';
import { render, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const feature = loadFeature('./src/features/showHideAnEventsDetails.feature');

defineFeature(feature, (test) => {
  let AppComponent;

  test('An event element is collapsed by default', ({ given, when, then }) => {
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

    then('all event details should be hidden by default', () => {
      const AppDOM = AppComponent.container.firstChild;
      const eventDetails = AppDOM.querySelector('.event .details');
      expect(eventDetails).not.toBeInTheDocument();
    });
  });

  test('User can expand an event to see details', ({ given, when, then }) => {
    given('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    when('the user clicks the show details button on an event', async () => {
      const AppDOM = AppComponent.container.firstChild;
      await waitFor(() => {
        const eventList = within(AppDOM).queryAllByRole('listitem');
        expect(eventList.length).toBeGreaterThan(0);
      });

      const user = userEvent.setup();
      const detailsButton = AppDOM.querySelector('.event .details-btn');
      await user.click(detailsButton);
    });

    then('the event details should be displayed', () => {
      const AppDOM = AppComponent.container.firstChild;
      const eventDetails = AppDOM.querySelector('.event .details');
      expect(eventDetails).toBeInTheDocument();
    });
  });

  test('User can collapse an event to hide details', ({
    given,
    and,
    when,
    then,
  }) => {
    given('the user opens the app', () => {
      AppComponent = render(<App />);
    });

    and('the event details are showing', async () => {
      const AppDOM = AppComponent.container.firstChild;
      await waitFor(() => {
        const eventList = within(AppDOM).queryAllByRole('listitem');
        expect(eventList.length).toBeGreaterThan(0);
      });

      const user = userEvent.setup();
      const detailsButton = AppDOM.querySelector('.event .details-btn');
      await user.click(detailsButton);

      const eventDetails = AppDOM.querySelector('.event .details');
      expect(eventDetails).toBeInTheDocument();
    });

    when('the user clicks the hide details button', async () => {
      const user = userEvent.setup();
      const AppDOM = AppComponent.container.firstChild;
      const detailsButton = AppDOM.querySelector('.event .details-btn');
      await user.click(detailsButton);
    });

    then('the event details should be hidden', () => {
      const AppDOM = AppComponent.container.firstChild;
      const eventDetails = AppDOM.querySelector('.event .details');
      expect(eventDetails).not.toBeInTheDocument();
    });
  });
});
