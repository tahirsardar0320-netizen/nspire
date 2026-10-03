import { NextRequest, NextResponse } from 'next/server';
import { clientKey, rateLimit } from '@/lib/chatbot/rateLimit';

export const runtime = 'nodejs';

const MODEL = 'gpt-4o-mini-transcribe';
const MAX_AUDIO_BYTES = 8 * 1024 * 1024;

/**
 * POST /api/chatbot/transcribe — turn a recorded voice clip into text for the
 * chat box. Server-side transcription rather than the browser's SpeechRecognition
 * API, which only Chrome implements properly.
 */
export async function POST(req: NextRequest) {
  if (!rateLimit(clientKey(req), 15, 60_000)) {
    return NextResponse.json(
      { success: false, message: 'Too many recordings. Please wait a moment.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: 'Voice input is not configured on the server yet.' },
      { status: 503 }
    );
  }

  try {
    const form = await req.formData();
    const audio = form.get('audio');

    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json(
        { success: false, message: 'No audio was received.' },
        { status: 400 }
      );
    }
    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json(
        { success: false, message: 'That recording is too long. Please keep it under a minute.' },
        { status: 400 }
      );
    }

    const upstream = new FormData();
    // OpenAI picks the decoder from the extension, so give it one that matches.
    const extension = (audio.type.split('/')[1] || 'webm').split(';')[0];
    upstream.append('file', audio, `recording.${extension}`);
    upstream.append('model', MODEL);
    upstream.append('language', 'en');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}` },
        body: upstream,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const detail = await response.text();
      console.error('OpenAI transcribe error', response.status, detail.slice(0, 500));
      return NextResponse.json(
        { success: false, message: "Couldn't read that recording. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const text = String(data?.text ?? '').trim();

    if (!text) {
      return NextResponse.json(
        { success: false, message: "Didn't catch that — please try again." },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, text });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'That took too long. Please try again.' },
        { status: 504 }
      );
    }
    console.error('POST /api/chatbot/transcribe error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
