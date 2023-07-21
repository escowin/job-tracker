const jwt = require("jsonwebtoken");

// optional | secrets should be stored in .env
const secret = "testSecret";
const expiration = "14d";

module.exports = {
 // middleware | verifies jwt
  authMiddleware: function ({ req }) {
    // allows jwt to be sent via body, query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // seperates 'Bearer' from '<token value>'
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // no token returns request object as is
    if (!token) {
      return req;
    }

    // users w/ invalid tokens can still req & see thoughts
    try {
      // decodes and attaches user data to req obj
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log("invalid token");
    }

    // returns the updated req obj
    return req;
  },
  // expects user object & adds user's properties to the token
  signToken: function ({ username, _id }) {
    const payload = { username, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
