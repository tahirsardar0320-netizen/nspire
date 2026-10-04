import { NextRequest, NextResponse } from 'next/server';
import { asContext, retrieve } from '@/lib/chatbot/retrieval';
import { SYSTEM_PROMPT, buildGroundedPrompt } from '@/lib/chatbot/prompt';
import { clientKey, rateLimit } from '@/lib/chatbot/rateLimit';

export const runtime = 'nodejs';

const MODEL = 'gpt-4o-mini';
const MAX_MESSAGE_CHARS = 1200;
const MAX_HISTORY_TURNS = 8;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // ~4MB decoded

type HistoryTurn = { role: 'user' | 'assistant'; content: string };

export async function POST(req: NextRequest) {
  if (!rateLimit(clientKey(req), 20, 60_000)) {
    return NextResponse.json(
      { success: false, message: 'Too many messages. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { success: false, message: 'The assistant is not configured on the server yet.' },
      { status: 503 }
    );
  }

  try {
    const body = await req.json();
    const message = String(body?.message ?? '').trim();
    const image = typeof body?.image === 'string' ? body.image : null;
    const area = typeof body?.area === 'string' ? body.area : undefined;

    if (!message && !image) {
      return NextResponse.json(
        { success: false, message: 'Please type a question.' },
        { status: 400 }
      );
    }
    if (message.length > MAX_MESSAGE_CHARS) {
      return NextResponse.json(
        { success: false, message: `Please keep your question under ${MAX_MESSAGE_CHARS} characters.` },
        { status: 400 }
      );
    }
    if (image) {
      if (!/^data:image\/(png|jpe?g|webp|gif);base64,/i.test(image)) {
        return NextResponse.json(
          { success: false, message: 'Please attach a PNG, JPG, WEBP or GIF image.' },
          { status: 400 }
        );
      }
      const base64 = image.slice(image.indexOf(',') + 1);
      if (base64.length * 0.75 > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { success: false, message: 'That image is too large. Please attach one under 4MB.' },
          { status: 400 }
        );
      }
    }

    const history: HistoryTurn[] = Array.isArray(body?.history)
      ? body.history
          .filter(
            (turn: any) =>
              (turn?.role === 'user' || turn?.role === 'assistant') &&
              typeof turn?.content === 'string' &&
              turn.content.trim()
          )
          .slice(-MAX_HISTORY_TURNS)
          .map((turn: any) => ({
            role: turn.role,
            content: String(turn.content).slice(0, MAX_MESSAGE_CHARS),
          }))
      : [];

    // Retrieve against the question plus the last user turn, so follow-ups like
    // "and if it's bigger than that?" still pull the right part of the corpus.
    const previousUser = [...history].reverse().find((turn) => turn.role === 'user');
    const retrievalQuery = previousUser ? `${previousUser.content} ${message}` : message;
    const chunks = retrieve(retrievalQuery || 'property inspection deficiency', 8, area);

    const grounded = buildGroundedPrompt(
      message || 'Please review the attached photo for NSPIRE deficiencies.',
      asContext(chunks)
    );

    const userContent: any = image
      ? [
          { type: 'text', text: grounded },
          { type: 'image_url', image_url: { url: image, detail: 'low' } },
        ]
      : grounded;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let response: Response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.2,
          max_tokens: 500,
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: userContent },
          ],
        }),
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const detail = await response.text();
      console.error('OpenAI chat error', response.status, detail.slice(0, 500));
      return NextResponse.json(
        { success: false, message: 'The assistant is having trouble right now. Please try again.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json(
        { success: false, message: 'The assistant did not return an answer. Please try again.' },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      reply,
      sources: chunks.slice(0, 3).map((chunk) => ({
        area: chunk.area,
        category: chunk.category,
        title: chunk.title,
      })),
    });
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return NextResponse.json(
        { success: false, message: 'That took too long. Please try again.' },
        { status: 504 }
      );
    }
    console.error('POST /api/chatbot/chat error:', error);
    return NextResponse.json(
      { success: false, message: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
