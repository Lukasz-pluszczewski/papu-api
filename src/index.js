import http from 'http';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import config from './config';
import api from 'v1';

import log from 'all-log';
import resourceCrud from './services/resourceCrud';
console.log('get', resourceCrud.get('posts', {}, undefined, true).size().value());

log('get', resourceCrud.get('posts', { title: 'Post 1' }));

const app = express();
app.server = http.createServer(app);

// body parser and cors middlewares
app.use(cors({
  origin: true,
  credentials: true,
  exposedHeaders: config.corsHeaders,
}));
app.use(bodyParser.json({
  limit: config.bodyLimit,
}));

app.use(api());

// starting actual server
app.server.listen(config.port);

console.log(`Started on port ${app.server.address().port}`); // eslint-disable-line no-console
