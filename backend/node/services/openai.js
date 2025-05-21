import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function callOpenAI(prompt) {
  // gpt-4o, single response, simple completion
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: 'You are a helpful AI assistant.' },
      { role: 'user', content: prompt }
    ],
    max_tokens: 512,
    temperature: 0.7
  });

  // Return the text of the first choice
  return response.choices[0].message.content;
}
