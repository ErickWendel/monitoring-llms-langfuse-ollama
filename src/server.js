Object.keys(process.env).forEach(key => {
  if (!process.env[key].includes('${DOMAIN}')) return
  
  process.env[key] = process.env[key].replace('${DOMAIN}', process.env.DOMAIN)
});

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
  model: process.env.OPENAI_MODEL,
  baseURL: process.env.OPENAI_SITE_URL,
  apiKey: process.env.OPENAI_API_KEY,
}


const langfuse = new Langfuse()
const span = langfuse.trace({ name: 'ewacademy-openai' })
const openai = observeOpenAI(new OpenAI(openAIData), {
  parent: span
});

console.log('Starting prompt');
for await (const chunk of prompt('tell me a joke')) {
  console.log(chunk);
}
console.log('Prompt done');

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

