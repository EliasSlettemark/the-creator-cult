import { NextResponse } from "next/server";
import { google } from "googleapis";

// Prevent prerendering - this route should only run at request time
export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    },
  });
  const calendar = google.calendar({ version: "v3", auth });

  const res = await calendar.events.list({
    calendarId: "primary",
    timeMin: new Date().toISOString(), 
    maxResults: 5,
    singleEvents: true,
    orderBy: "startTime", 
  });

  const events = res.data.items ?? [];

  const formatted = events.map((event) => ({
    title: event.summary,
    date: event.start?.dateTime || event.start?.date,
  }));

  return NextResponse.json({ events: formatted });
}