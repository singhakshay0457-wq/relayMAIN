import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const ADMIN_EMAIL = 'singhakshay0457@gmail.com';

export interface MeetingNotificationData {
  meetingType: string;
  durationMinutes: number;
  dateString: string;
  timeSlot: string;
  timeZone: string;
  name: string;
  email: string;
  company?: string;
  notes?: string;
}

export interface ContactNotificationData {
  name: string;
  email: string;
  company?: string;
  service?: string;
  message: string;
}

export interface PartnershipNotificationData {
  name: string;
  email: string;
  company: string;
  type: string;
  message: string;
}

/**
 * Sends real email notifications directly to singhakshay0457@gmail.com
 * using FormSubmit AJAX + saves structured notification records to Firestore.
 */
export async function sendEmailNotification(subject: string, details: Record<string, any>, replyToEmail?: string) {
  // 1. Save record in Firestore 'notifications' collection
  try {
    await addDoc(collection(db, 'notifications'), {
      targetAdmin: ADMIN_EMAIL,
      subject,
      details,
      createdAt: new Date().toISOString(),
      serverCreatedAt: serverTimestamp()
    });
  } catch (err) {
    console.warn('Firestore notification log warning:', err);
  }

  // 2. Dispatch real email to singhakshay0457@gmail.com via FormSubmit AJAX endpoint
  try {
    const response = await fetch(`https://formsubmit.co/ajax/${ADMIN_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        _subject: subject,
        _template: 'table',
        _captcha: 'false',
        _replyto: replyToEmail || details.email || ADMIN_EMAIL,
        ...details
      })
    });
    const result = await response.json();
    return result.success !== 'false';
  } catch (err) {
    console.error('Failed to send email notification:', err);
    return false;
  }
}

export async function notifyNewMeeting(data: MeetingNotificationData) {
  const subject = `📅 New Meeting Booked: ${data.meetingType} - ${data.name}`;
  const details = {
    'Notification Type': 'New Meeting Scheduled',
    'Client Name': data.name,
    'Client Email': data.email,
    'Company': data.company || 'N/A',
    'Meeting Title': data.meetingType,
    'Duration': `${data.durationMinutes} Minutes`,
    'Date & Time': `${data.dateString} at ${data.timeSlot} (${data.timeZone})`,
    'Notes / Goal': data.notes || 'None provided',
    'Submitted At': new Date().toLocaleString()
  };
  return sendEmailNotification(subject, details, data.email);
}

export async function notifyNewSubscriber(subscriberEmail: string) {
  const subject = `📬 New Newsletter Subscription: ${subscriberEmail}`;
  const details = {
    'Notification Type': 'Newsletter Subscriber',
    'Subscriber Email': subscriberEmail,
    'Submitted At': new Date().toLocaleString()
  };
  return sendEmailNotification(subject, details, subscriberEmail);
}

export async function notifyNewContactMessage(data: ContactNotificationData) {
  const subject = `💬 New Contact Inquiry from ${data.name}`;
  const details = {
    'Notification Type': 'Contact Form Submission',
    'Sender Name': data.name,
    'Sender Email': data.email,
    'Company': data.company || 'N/A',
    'Service Requested': data.service || 'General Inquiry',
    'Message': data.message,
    'Submitted At': new Date().toLocaleString()
  };
  return sendEmailNotification(subject, details, data.email);
}

export async function notifyNewPartnership(data: PartnershipNotificationData) {
  const subject = `🤝 New Partnership Inquiry from ${data.name} (${data.company})`;
  const details = {
    'Notification Type': 'Partnership Form Submission',
    'Contact Name': data.name,
    'Contact Email': data.email,
    'Company': data.company,
    'Partnership Type': data.type,
    'Message': data.message,
    'Submitted At': new Date().toLocaleString()
  };
  return sendEmailNotification(subject, details, data.email);
}
