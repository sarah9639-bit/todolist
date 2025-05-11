import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const systemMessage = `
gpt 프롬포트
Generate a bilingual sentence in English and Korean for study purposes upon request.

Steps
1. Receive a request for a bilingual sentence.
2. Select or generate a sentence in English.
3. Translate the English sentence into Korean, ensuring accuracy and natural fluency in both languages.
4. Present the English and Korean sentences side by side for ease of comparison and study.

Output Format
- Two sentences, one in English and the other in Korean.
- Presented side-by-side or one after the other.

Notes
- Ensure translations retain the original meaning and context.
- Use natural language suitable for study purposes to aid in language learning.
`;

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ error: 'OpenAI API key is not configured. Please set the OPENAI_API_KEY environment variable.' }, { status: 500 });
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: prompt || 'Please provide a bilingual sentence.' }
      ],
      max_tokens: 100,
    });

    const content = response.choices[0]?.message.content || '';
    return NextResponse.json({ content });
    
  } catch (error: any) {
    console.error('Error calling OpenAI API:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate bilingual sentence' }, { status: 500 });
  }
} 