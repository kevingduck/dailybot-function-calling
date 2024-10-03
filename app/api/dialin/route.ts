// app/api/dialin/route.ts

import { NextResponse } from 'next/server';
import { botConfig } from '../../../rtvi.config'; // Adjust the path if necessary

export async function POST(request: Request) {
  const { test, callId, callDomain } = await request.json();

  if (test) {
    // Webhook creation test response
    return NextResponse.json({ test: true }, { status: 200 });
  }

  if (!callId || !callDomain || !process.env.DAILY_API_KEY) {
    return NextResponse.json(
      { error: 'callId and/or callDomain not found on request body' },
      { status: 400 }
    );
  }

  // Merge botConfig with dialin_settings
  const payload = {
    ...botConfig,
    dialin_settings: {
      callId,
      callDomain,
    },
  };

  const response = await fetch('https://api.daily.co/v1/bots/start', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(result, { status: response.status });
  }

  return NextResponse.json(result);
}
