const express = require('express');
const postsRouter = require('./data/postsRouter.js')

const server = express();

server.use(express.json());
server.use('/api/posts',postsRouter)

server.get('/', (req, res) => {
    res.send(`
      <h2>Web API II Challenge</h>
      <p>There are posts with comments</p>
    `);
  });

module.exports = server;