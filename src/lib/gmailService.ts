import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './firebase';

const provider = new GoogleAuthProvider();

// Add Gmail scopes requested by the user
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');
provider.addScope('https://mail.google.com/');

// In-memory token cache (Do NOT store in localStorage/sessionStorage)
let cachedAccessToken: string | null = null;
let isSigningIn = false;

// Initialize auth state listener. Call this on app load.
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Token might have cleared or not loaded yet. Force a login check.
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Start Google sign-in flow (Must be triggered by user click)
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to retrieve access token from Google Auth');
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('OAuth Sign-in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Retrieve currently cached access token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Logout and clear state
export const googleSignOut = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};

// Interface definitions for Gmail UI
export interface GmailMessage {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  body: string;
  labels: string[];
}

// REST call helpers
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Not authenticated: Access token missing');
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP error! Status: ${response.status}`);
  }

  return response;
};

// List messages
export const listMessages = async (maxResults = 10): Promise<{ id: string; threadId: string }[]> => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
  const response = await fetchWithAuth(url);
  const data = await response.json();
  return data.messages || [];
};

// Helper to parse Gmail headers
const getHeaderValue = (headers: { name: string; value: string }[], name: string): string => {
  const found = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return found ? found.value : '';
};

// Helper to decode Gmail message body (supports multipart)
const parseMessageBody = (payload: any): string => {
  if (!payload) return '';
  
  if (payload.body?.data) {
    return decodeBase64Url(payload.body.data);
  }

  if (payload.parts) {
    // Look for text/html first, then text/plain
    const htmlPart = payload.parts.find((part: any) => part.mimeType === 'text/html');
    if (htmlPart && htmlPart.body?.data) {
      return decodeBase64Url(htmlPart.body.data);
    }

    const plainPart = payload.parts.find((part: any) => part.mimeType === 'text/plain');
    if (plainPart && plainPart.body?.data) {
      return `<pre style="font-family: inherit; white-space: pre-wrap;">${decodeBase64Url(plainPart.body.data)}</pre>`;
    }

    // Recursive search in subparts
    for (const part of payload.parts) {
      const nestedBody = parseMessageBody(part);
      if (nestedBody) return nestedBody;
    }
  }

  return '';
};

// Decode Base64URL
const decodeBase64Url = (base64url: string): string => {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  try {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder('utf-8').decode(bytes);
  } catch (e) {
    console.error('Error decoding base64url:', e);
    return 'Decoding error...';
  }
};

// Fetch full message details
export const getMessageDetails = async (id: string): Promise<GmailMessage> => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`;
  const response = await fetchWithAuth(url);
  const data = await response.json();

  const headers = data.payload?.headers || [];
  const subject = getHeaderValue(headers, 'subject') || '(No Subject)';
  const from = getHeaderValue(headers, 'from') || '(Unknown Sender)';
  const to = getHeaderValue(headers, 'to') || '(Unknown Recipient)';
  const date = getHeaderValue(headers, 'date') || '';
  const snippet = data.snippet || '';
  const body = parseMessageBody(data.payload) || snippet;

  return {
    id: data.id,
    threadId: data.threadId,
    subject,
    from,
    to,
    date,
    snippet,
    body,
    labels: data.labelIds || [],
  };
};

// Base64URL Encode (Standard safe UTF-8 encoding)
const base64UrlEncode = (str: string): string => {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = window.btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

// Send an Email
export const sendEmail = async (to: string, subject: string, body: string): Promise<any> => {
  const emailLines = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    body
  ].join('\r\n');

  const raw = base64UrlEncode(emailLines);

  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  const response = await fetchWithAuth(url, {
    method: 'POST',
    body: JSON.stringify({ raw }),
  });

  return response.json();
};

// Trash/Archive Message
export const trashMessage = async (id: string): Promise<any> => {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}/trash`;
  const response = await fetchWithAuth(url, {
    method: 'POST',
  });
  return response.json();
};
