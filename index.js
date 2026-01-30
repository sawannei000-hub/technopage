import express from 'express';
import { createServer } from 'node:http';
import { uvPath } from '@titaniumnetwork-dev/ultraviolet';
import { createBareServer } from '@tomphttp/bare-server-node';
import path from 'node:path';

const app = express();
const server = createServer();
const bare = createBareServer('/bare/');

// Serve the 'public' folder for our front-end
app.use(express.static(path.join(process.cwd(), 'public')));

// Set up Ultraviolet routes
app.use('/uv/', express.static(uvPath));

server.on('request', (req, res) => {
    if (bare.shouldRoute(req)) {
        bare.route(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bare.shouldRoute(req)) {
        bare.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

server.listen(3000, () => console.log('Server is live!'));
