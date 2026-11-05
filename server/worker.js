// Cloudflare Workers entry point. Workers has no TCP sockets, so the port below is
// only a routing key that connects httpServerHandler to the Express server.
import { httpServerHandler } from 'cloudflare:node';
import { createApp } from './app.js';

const PORT = 8080;

createApp().listen(PORT);

export default httpServerHandler({ port: PORT });
