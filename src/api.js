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
// --- Utility Functions ---
const removeQuery = () => {
  let newurl;
  if (window.history.pushState && window.location.pathname) {
    newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname;
  } else {
    newurl = window.location.protocol + '//' + window.location.host;
    window.history.pushState('', '', newurl);
  }
};

export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

// --- Auth Functions ---
const checkToken = async (accessToken) => {
  const response = await fetch(
    `https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/get-events?access_token=${accessToken}`
  );
  const result = await response.json();
  return result;
};

const getToken = async (code) => {
  const encodeCode = encodeURIComponent(code);
  const response = await fetch(
    'https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/token/' +
      '/' +
      encodeCode
  );
  const { access_token } = await response.json();
  access_token && localStorage.setItem('access_token', access_token);

  return access_token;
};

export const getAccessToken = async () => {
  const accessToken = localStorage.getItem('access_token');

  const tokenCheck = accessToken && (await checkToken(accessToken));

  if (!accessToken || tokenCheck.error) {
    await localStorage.removeItem('access_token');
    const searchParams = new URLSearchParams(window.location.search);
    const code = await searchParams.get('code');
    if (!code) {
      const response = await fetch(
        'https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url'
      );
      const result = await response.json();
      const { authUrl } = result;
      return (window.location.href = authUrl);
    }
    return code && getAccessToken(code);
  }
  return accessToken;
};

/**
 *
 * This function will fetch the list of all events
 */
//-- Main API Functions ---
export const getEvents = async () => {
  if (window.location.href.startsWith('http://localhost')) {
    return mockData;
  }

  const token = await getAccessToken();

  if (token) {
    removeQuery();
    const url =
      'https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/get-events/' +
      '/' +
      token;
    const response = await fetch(url);
    const result = await response.json();
    if (result) {
      return result.events;
    } else return null;
  }
};
