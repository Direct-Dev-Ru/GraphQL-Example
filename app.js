const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { ApolloServer, gql } = require("apollo-server-express");

const port = process.env.PORT || 8000;

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;
const resolvers = { Query: { hello: () => "Hello world!" } };

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
//Настраиваем Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

//Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: "/api" });

app.use("/", indexRouter);

const listener = app.listen(port, function () {
  console.log(
    `GraphQL Server running at http://localhost:${listener.address().port}${
      server.graphqlPath
    }`
  );
});
