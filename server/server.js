const path = require("path");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");
const db = require("./config/connection");

// server
const PORT = process.env.port || 3001;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
  cache: "bounded"
});

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// serves up static assets for production environment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// new apollo server w/ graphql schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  // integrates apollo server with express app as middleware
  server.applyMiddleware({ app });

  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      console.log(`graphql http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

// call | starts server
startApolloServer(typeDefs, resolvers);