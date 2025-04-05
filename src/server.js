import OpenAI from 'openai';
import { createLRU } from 'lru.min';
import { observeOpenAI, Langfuse } from 'langfuse';

import Fastify from 'fastify';
const PORT = process.env.APP_PORT;

const app = Fastify({ logger: true })

const lru = createLRU({
  max: 150_000,
  onEviction: (key, value) => {
    console.log('evicted', key, value);
  },
});

const openAIData = {
  model: process.env.OPENROUTER_MODEL,
  baseURL: process.env.OPENROUTER_SITE_URL,
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    'HTTP-Referer': process.env.OPENROUTER_SITE_URL, // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': process.env.OPENROUTER_SITE_NAME, // Optional. Site title for rankings on openrouter.ai.
  },
}

const langfuse = new Langfuse()
const span = langfuse.trace({ name: 'ewacademy-openai' })
const openai = observeOpenAI(new OpenAI(openAIData), {
  parent: span
});


async function* prompt(content) {
  const completion = await openai.chat.completions.create({
    model: openAIData.model,
    messages: [
      {
        role: 'user',
        content: content,
      },
    ],
    stream: true,
  });

  for await (const chunk of completion) {
    yield chunk.choices[0].delta.content;
  }
}

app.post('/question', async (request, reply) => {
  const { question } = request.body;

  // Check cache
  const cached = lru.get(question);
  if (cached) {
    return reply.status(200).send(cached);
  }

  try {
    const responseStream = await prompt(question);
    const chunks = [];

    reply.raw.writeHead(200, { 'Content-Type': 'text/plain' });
    for await (const chunk of responseStream) {
      chunks.push(chunk);
      reply.raw.write(chunk);
    }
    reply.raw.end();

    // Cache result
    const fullText = chunks.join('');
    lru.set(question, fullText);

    return; // 200 OK by default for Fastify when no error
  } catch (error) {
    app.log.error(error);

    return reply.status(500).send({ message: 'Internal Server Error' });
  }
});

const address = await app.listen({ host: '0.0.0.0', port: PORT })
app.log.info(`Server is running on ${address}`);

