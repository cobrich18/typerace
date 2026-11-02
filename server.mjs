import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {DatabaseSync} from 'node:sqlite';

const {default: worker} = await import('./dist/server/index.js');
const database = new DatabaseSync(':memory:');
const schema = (await readFile(new URL('./drizzle/0000_rooms.sql', import.meta.url), 'utf8')).replaceAll('--> statement-breakpoint', '');
database.exec(schema);

const DB = {
  prepare(sql) {
    const statement = database.prepare(sql);
    return {
      bind(...values) {
        return {
          first: async () => statement.get(...values),
          all: async () => ({results: statement.all(...values)}),
          run: async () => ({meta: {changes: statement.run(...values).changes}})
        };
      }
    };
  }
};

const server = createServer(async (incoming, outgoing) => {
  try {
    const chunks = [];
    let size = 0;
    for await (const chunk of incoming) {
      size += chunk.length;
      if (size > 32768) {
        outgoing.writeHead(413, {'content-type':'text/plain; charset=utf-8'});
        outgoing.end('Request too large');
        return;
      }
      chunks.push(chunk);
    }
    const url = new URL(incoming.url || '/', 'http://localhost');
    const method = incoming.method || 'GET';
    const request = new Request(url, {
      method,
      headers: incoming.headers,
      ...(method === 'GET' || method === 'HEAD' ? {} : {body: Buffer.concat(chunks)})
    });
    const response = await worker.fetch(request, {DB});
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error('HTTP request failed', error);
    if (!outgoing.headersSent) outgoing.writeHead(500, {'content-type':'text/plain; charset=utf-8'});
    outgoing.end('Internal server error');
  }
});

const port = Number(process.env.PORT || 10000);
server.listen(port, '0.0.0.0', () => console.log(`TypeRace listening on 0.0.0.0:${port}`));
