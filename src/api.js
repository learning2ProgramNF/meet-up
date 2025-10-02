// src/api.js

import mockData from './mock-data';

/**
 *
 *
 *  The following function should be in the "api.js" file.
 *  This functions takes and events array, then uses map to creata a new array
 *  with only locations.
 *  It will also remove all duplicates by creating another new array
 *  using the spread operator and spreading a Set
 *  This will remove all duplicates from the array
 */

export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

/**
 *
 * This function will fetch the list of all events
 */
export const getEvents = async () => {
  return mockData;
};
