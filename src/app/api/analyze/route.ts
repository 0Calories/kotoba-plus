import { type NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI();

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json();

    if (!word) {
      return NextResponse.json({ error: 'Word is required' }, { status: 400 });
    }

    const response = await client.responses.create({
      prompt: {
        id: 'pmpt_68d7070e64488190a675dfd966ac12da0f59e9ba4d15d152',
        version: '1',
        variables: {
          word: word,
        },
      },
    });

    if (response.error) {
      throw new Error(`OpenAI Error ${response.error.code}: ${response.error.message}`);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in analyze API:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to analyze word',
      },
      { status: 500 },
    );
  }
}
