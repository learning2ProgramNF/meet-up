Feature: Specify Number of Events

  Scenario: When user hasn't specified a number, 32 events are shown by default
    Given the user opens the app
    When the user views the event list
    Then 32 events should be displayed by default

  Scenario: User can change the number of events displayed
    Given the user opens the app
    When the user changes the number of events to 10
    Then 10 events should be displayed