import http from 'http';
import Radio from './radio.js';

const radio = new Radio();
radio.start();

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    const { id, passthrough } = radio.subscribe();

    req.on('close', () => {
      radio.unsubscribe(id);
    });

    res.writeHead(200, {
      'Access-Control-Allow-Methods': 'GET, OPTIONS, HEAD',
      'Content-Type': 'audio/mpeg',
      'Cache-Control': 'no-cache, no-store',
      Connection: 'close',
      Expires: 'Mon, 26 Jul 1997 05:00:00 GMT',
    });

    passthrough.on('data', (chunk) => {
      res.write(chunk);
    });

    passthrough.on('end', () => {
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, (err) => {
  if (err) throw err;
  console.log('Server running on http://localhost:3000');
});
