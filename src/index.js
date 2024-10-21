import http from 'http';
import Radio from './radio.js';

let radio;

const port = process.argv[2] ? parseInt(process.argv[2], 10) : 3000;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const { id, passthrough } = radio.subscribe();

    req.on('close', () => radio.unsubscribe(id));

    res.writeHead(200, {
      'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache, no-store',
      'Transfer-Encoding': 'chunked',
    });

    passthrough.on('data', (chunk) => res.write(chunk));
    passthrough.on('end', () => res.end());
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(port, (err) => {
  if (err) throw err;
  radio = new Radio();
  console.log(`Server running on http://localhost:${port}`);
});
