'use strict';

import { google } from 'googleapis';
const calendar = google.calendar('v3');
const SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];
import process from 'process';
const { CLIENT_ID, CLIENT_SECRET, CALENDAR_ID } = process.env;
const redirect_uris = ['https://meet-up-beryl.vercel.app'];
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  redirect_uris[0]
);

console.log('Redirect URI:', redirect_uris[0]);

export async function getAuthURL() {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      authUrl,
    }),
  };
}

export async function getAccessToken(event) {
  // Decode authorization code extracted from URL query
  const code = decodeURIComponent(`${event.queryStringParameters.code}`);

  if (!code) {
    return Promise.reject({
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Missing code in query parameter' }),
    });
  }

  return new Promise((resolve, reject) => {
    oAuth2Client.getToken(code, (error, response) => {
      if (error) {
        reject({
          statusCode: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify({ error: 'Missing code in query parameter' }),
        });
      } else {
        resolve({
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Acccess-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(response),
        });
      }
    });
  });
}
export async function getCalendarEvents(event) {
  const access_token = decodeURIComponent(
    `${event.pathParameters.access_token}`
  );
  oAuth2Client.setCredentials({ access_token });

  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        calendarId: 'fullstackwebdev',
        auth: oAuth2Client,
        timeMin: new Date().toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      },
      (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response.data.items);
        }
      }
    );
  })
    .then((results) => {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ events: results }),
      };
    })
    .catch((error) => {
      return {
        statusCode: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify(error),
      };
    });
}
