import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'inspire_jwt_secret_key_2024';

// Analyses a deficiency photo against the NSPIRE standard. The inspection
// screen has always called this route; it was never implemented, so the
// "AI is analyzing the photo..." step failed every time.

const SEVERITIES = ['Life-Threatening', 'Severe', 'Moderate', 'Low'] as const;

// Mirrors what the inspection screen reads off the response, so the model
// cannot return a shape the caller doesn't understand.
const ANALYSIS_SCHEMA = {
  type: 'object',
  properties: {
    defect: {
      type: 'string',
      description: 'Short name for the defect visible in the photo, e.g. "Damaged Outlet Cover".',
    },
    description: {
      type: 'string',
      description: 'One or two sentences describing what is visible and why it is a deficiency.',
    },
    severity: {
      type: 'string',
      enum: SEVERITIES as unknown as string[],
      description: 'NSPIRE severity. Life-Threatening only for immediate danger to life or safety.',
    },
    nspireCode: {
      type: 'string',
      description: 'Best-matching NSPIRE standard code, or an empty string if none applies.',
    },
    complianceScore: {
      type: 'integer',
      description: 'Compliance score 0-100 for this item; lower means a more serious deficiency.',
    },
    observed: {
      type: 'boolean',
      description: 'False when no deficiency is visible in the photo.',
    },
  },
  required: ['defect', 'description', 'severity', 'nspireCode', 'complianceScore', 'observed'],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `You are assisting a certified inspector carrying out a HUD NSPIRE property inspection.

You are given one photograph and the inspector's own notes about it. Report only what is actually visible in the photograph.

- Do not invent damage that isn't there. If the photo shows no deficiency, set observed to false and severity to "Low".
- Reserve "Life-Threatening" for conditions that endanger life or safety right now, per NSPIRE.
- Give an NSPIRE code only when you are confident it applies; otherwise return an empty string.
- Your output assists the inspector's judgement. It does not replace it.`;

function getUserFromToken(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  try {
    return jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET) as any;
  } catch {
    return null;
  }
}

/**
 * The inspection screen falls back to a local data URI when photo upload
 * fails, so the image arrives either as `data:image/jpeg;base64,...` or as a
 * hosted URL. Claude takes both, but as different source shapes.
 */
function toImageSource(imageUrl: string): Anthropic.ImageBlockParam['source'] | null {
  const dataUri = /^data:(image\/(?:jpeg|png|gif|webp));base64,(.+)$/i.exec(imageUrl);
  if (dataUri) {
    return {
      type: 'base64',
      media_type: dataUri[1].toLowerCase() as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
      data: dataUri[2],
    };
  }
  if (/^https?:\/\//i.test(imageUrl)) {
    return { type: 'url', url: imageUrl };
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    // Each call costs money, so it stays behind a valid session.
    const user = getUserFromToken(req);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { imageUrl, deficiencyData } = await req.json();

    // Validate the request before the server config, so a malformed call is
    // reported as such whether or not analysis happens to be configured.
    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json({ success: false, message: 'A photo is required.' }, { status: 400 });
    }

    const source = toImageSource(imageUrl);
    if (!source) {
      return NextResponse.json(
        { success: false, message: 'That image format is not supported.' },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('/api/ai/inspect: ANTHROPIC_API_KEY is not configured');
      return NextResponse.json(
        { success: false, message: 'Photo analysis is not configured on the server.' },
        { status: 503 }
      );
    }

    const notes = [
      deficiencyData?.category && `Area: ${deficiencyData.category}`,
      deficiencyData?.subCategory && `Item: ${deficiencyData.subCategory}`,
      deficiencyData?.location && `Location: ${deficiencyData.location}`,
      deficiencyData?.selectedDeficiency?.selected && `Suspected deficiency: ${deficiencyData.selectedDeficiency.selected}`,
      deficiencyData?.note && `Inspector's note: ${deficiencyData.note}`,
    ]
      .filter(Boolean)
      .join('\n');

    const client = new Anthropic();

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      output_config: { format: { type: 'json_schema', schema: ANALYSIS_SCHEMA } },
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source },
            {
              type: 'text',
              text: notes
                ? `Assess this photo for NSPIRE deficiencies.\n\n${notes}`
                : 'Assess this photo for NSPIRE deficiencies.',
            },
          ],
        },
      ],
    });

    // Safety classifiers can decline, in which case content is empty — check
    // before reading it.
    if (response.stop_reason === 'refusal') {
      return NextResponse.json(
        { success: false, message: 'This photo could not be analysed. Please record the deficiency manually.' },
        { status: 422 }
      );
    }

    const text = response.content.find((b) => b.type === 'text');
    if (!text || text.type !== 'text') {
      return NextResponse.json(
        { success: false, message: 'No analysis was returned. Please try again.' },
        { status: 502 }
      );
    }

    const analysis = JSON.parse(text.text);

    // The caller reads data.deficiency and falls back to its own form values
    // for anything missing.
    return NextResponse.json({
      success: true,
      data: {
        deficiency: {
          defect: analysis.defect,
          description: analysis.description,
          severity: analysis.severity,
          nspireCode: analysis.nspireCode || undefined,
          complianceScore: analysis.complianceScore,
          observed: analysis.observed,
        },
      },
    });
  } catch (error: any) {
    console.error('POST /api/ai/inspect error:', error);
    if (error?.status === 429) {
      return NextResponse.json(
        { success: false, message: 'Analysis is busy right now. Please try again in a moment.' },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Could not analyse the photo. Please try again.' },
      { status: 500 }
    );
  }
}
