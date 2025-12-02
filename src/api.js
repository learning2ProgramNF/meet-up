// src/api.js

import mockData from './mock-data';

// Token cache to prevent repeated checks
let cachedToken = null;
let tokenCheckTime = null;
const TOKEN_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Utility function to extract unique locations from events
 */
export const extractLocations = (events) => {
  const extractedLocations = events.map((event) => event.location);
  const locations = [...new Set(extractedLocations)];
  return locations;
};

/**
 * Remove query parameters from URL
 */
const removeQuery = () => {
  if (window.history.pushState && window.location.pathname) {
    const newurl =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname;
    window.history.pushState('', '', newurl);
  }
};

/**
 * Check if access token is valid
 */
const checkToken = async (accessToken) => {
  try {
    const response = await fetch(
      `https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/token/${accessToken}`
    );
    const result = await response.json();
    return result;
  } catch (error) {
    return { error: 'Token check failed' };
  }
};

/**
 * Exchange authorization code for access token
 */
const getToken = async (code) => {
  try {
    const encodeCode = encodeURIComponent(code);
    const response = await fetch(
      `https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/token/${encodeCode}`
    );
    const { access_token } = await response.json();

    if (access_token) {
      localStorage.setItem('access_token', access_token);
      return access_token;
    }
  } catch (error) {
    console.error('Error getting token:', error);
  }
  return null;
};

/**
 * Get access token (from storage or via OAuth flow)
 */
export const getAccessToken = async () => {
  // For localhost, skip OAuth
  if (window.location.href.startsWith('http://localhost')) {
    return null;
  }

  // Return cached token if still valid
  if (
    cachedToken &&
    tokenCheckTime &&
    Date.now() - tokenCheckTime < TOKEN_CACHE_DURATION
  ) {
    return cachedToken;
  }

  const accessToken = localStorage.getItem('access_token');

  // Check if we have a valid token
  if (accessToken) {
    const tokenCheck = await checkToken(accessToken);
    if (!tokenCheck.error) {
      cachedToken = accessToken;
      tokenCheckTime = Date.now();
      return accessToken;
    }
    // Token invalid, remove it
    localStorage.removeItem('access_token');
    cachedToken = null;
    tokenCheckTime = null;
  }

  // Check for authorization code in URL
  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get('code');

  if (code) {
    // Exchange code for token
    const token = await getToken(code);
    if (token) {
      removeQuery();
      cachedToken = token;
      tokenCheckTime = Date.now();
      return token;
    }
  }

  // No token and no code, redirect to OAuth
  try {
    const response = await fetch(
      'https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/get-auth-url'
    );
    const result = await response.json();
    const { authUrl } = result;
    window.location.href = authUrl;
  } catch (error) {
    console.error('Error getting auth URL:', error);
  }

  return null;
};

/**
 * Fetch list of all events
 */
export const getEvents = async () => {
  // For localhost, return mock data
  if (window.location.href.startsWith('http://localhost')) {
    return mockData;
  }

  // For production, use OAuth
  try {
    const token = await getAccessToken();

    if (token) {
      const url = `https://8jjro4swqb.execute-api.us-east-1.amazonaws.com/dev/api/get-events/${token}`;
      const response = await fetch(url);
      const result = await response.json();

      if (result && result.events) {
        return result.events;
      }
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  }

  return [];
};
