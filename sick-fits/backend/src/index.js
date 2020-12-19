// let's go!
require('dotenv').config({ path: 'variables.env' });
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const createServer = require('./createServer');
const db = require('./db');

const server = createServer();

// use express middleware to handle cookies (JWT)
server.express.use(cookieParser());

// use express middleware to populate current user
server.express.use((req, res, next) => {
  // get the token from the cookie
  const { token } = req.cookies;
  // if we have a token (if we're signed in)
  if (token) {
    // get the id of the user thats contained in the token using jwt.verify
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // set the userId to the request, this means we have the current userID available to us for future reference
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL,
    },
  },
  (deets) => {
    console.log(`Server is now running on port http:/localhost:${deets.port}`);
  }
);
