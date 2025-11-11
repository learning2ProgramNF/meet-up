Feature: Show/Hide Event Details

  Scenario: An event element is collapsed by default
    Given the user opens the app
    When the user views the event list
    Then all event details should be hidden by default

  Scenario: User can expand an event to see details
    Given the user opens the app
    When the user clicks the show details button on an event
    Then the event details should be displayed

  Scenario: User can collapse an event to hide details
    Given the user opens the app
    And the event details are showing
    When the user clicks the hide details button
    Then the event details should be hidden