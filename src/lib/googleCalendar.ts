import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

const calendarProvider = new GoogleAuthProvider();
calendarProvider.addScope('https://www.googleapis.com/auth/calendar.events');
calendarProvider.addScope('https://www.googleapis.com/auth/calendar.readonly');
calendarProvider.addScope('https://www.googleapis.com/auth/calendar');

let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Listen to auth changes
export const initCalendarAuth = (
  onSuccess?: (user: User, token: string) => void,
  onFail?: () => void
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && cachedAccessToken) {
      if (onSuccess) onSuccess(user, cachedAccessToken);
    } else {
      cachedAccessToken = null;
      if (onFail) onFail();
    }
  });
};

export const signInWithGoogleCalendar = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, calendarProvider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not retrieve access token from Google authentication.');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: credential.accessToken };
  } catch (error) {
    console.error('Error signing in with Google Calendar:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getCalendarToken = () => cachedAccessToken;

export interface CalendarEventPayload {
  summary: string;
  description?: string;
  startDateTime: string; // ISO format e.g. 2026-08-04T10:00:00Z
  endDateTime: string;   // ISO format e.g. 2026-08-04T10:30:00Z
  timeZone?: string;
  attendees?: { email: string; displayName?: string }[];
}

/**
 * Creates an event on the user's primary Google Calendar via Google Calendar API REST endpoints.
 */
export async function createGoogleCalendarEvent(accessToken: string, event: CalendarEventPayload) {
  const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1';
  
  const body = {
    summary: event.summary,
    description: event.description || '',
    start: {
      dateTime: event.startDateTime,
      timeZone: event.timeZone || 'UTC',
    },
    end: {
      dateTime: event.endDateTime,
      timeZone: event.timeZone || 'UTC',
    },
    attendees: event.attendees || [],
    conferenceData: {
      createRequest: {
        requestId: `relay-${Date.now()}`,
        conferenceSolutionKey: { type: 'hangoutsMeet' }
      }
    },
    reminders: {
      useDefault: true
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to create Google Calendar event');
  }

  return await response.json();
}

/**
 * Fetches upcoming events from the user's primary Google Calendar.
 */
export async function fetchUpcomingCalendarEvents(accessToken: string, maxResults = 10) {
  const nowISO = new Date().toISOString();
  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(nowISO)}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch Google Calendar events');
  }

  const data = await response.json();
  return data.items || [];
}

/**
 * Delete an event from the user's primary Google Calendar with mandatory confirmation.
 */
export async function deleteCalendarEvent(accessToken: string, eventId: string, eventSummary: string) {
  const confirmDelete = window.confirm(
    `Are you sure you want to remove the event "${eventSummary}" from your Google Calendar?`
  );
  if (!confirmDelete) return false;

  const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok && response.status !== 204) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to delete event from Google Calendar');
  }

  return true;
}
