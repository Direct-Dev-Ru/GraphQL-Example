const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { ApolloServer } = require('apollo-server-express');
const db = require('./data/mongodb/db');
const models = require('./data/mongodb/models');
const typeDefs = require('./data/graphql/schema');
const resolvers = require('./data/graphql/resolvers');
require('dotenv').config();
// sss444
const port = process.env.PORT || 8000;
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME;
const DB_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD;

console.log(
  `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}?authSource=admin`
);
db.connect(
  `mongodb://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}?authSource=admin`
);

const indexRouter = require('./routes/index');

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
console.log(__dirname);

app.use(express.static(path.join(__dirname, 'public')));
//Настраиваем Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => {
    return { models };
  }
});

// !Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/api' });

app.use('/', indexRouter);

const listener = app.listen(port, function () {
  console.log(
    `GraphQL Server running at http://localhost:${listener.address().port}${
      server.graphqlPath
    }`
  );
});
