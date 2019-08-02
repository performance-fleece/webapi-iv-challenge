const express = require('express');
const cors = require('cors');

const userRouter = require('./users/UserRouter');
const postRouter = require('./posts/postRouter');

const server = express();
server.use(logger);
server.use(express.json());
server.use(cors());

server.use('/api/users', userRouter);
server.use('/api/posts', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const time = new Date();
  console.log(`${req.method} to ${req.path} at ${time.toISOString()}`);
  next();
}

module.exports = server;
