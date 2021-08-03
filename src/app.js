const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./data/mongodb/db');
const models = require('./data/mongodb/models');

require('dotenv').config();

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

let notes = [
  { id: '1', content: 'This is a note', author: 'Adam Scott' },
  { id: '2', content: 'This is another note', author: 'Harlow Everly' },
  { id: '3', content: 'Oh hey look, another note!', author: 'Riley Harrison' }
];

const typeDefs = gql`
  type Query {
    hello: String!
    notes: [Note!]!
    note(id: ID!): Note!
  }

  type Note {
    id: ID!
    content: String!
    author: String!
  }

  type Mutation {
    newNote(content: String!): Note!
  }
`;

const resolvers = {
  Query: {
    hello: () => 'Hello world!',
    // notes: () => notes,
    notes: async () => {
      return await models.Note.find();
    },
    note: async (parent, args) => {
      return await models.Note.findById(args.id);
    }
  },

  Mutation: {
    newNote: async (parent, args) => {
      return await models.Note.create({
        content: args.content,
        author: 'Adam Scott'
      });
    }
  }
};

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
console.log(__dirname);

app.use(express.static(path.join(__dirname, 'public')));
//Настраиваем Apollo Server
const server = new ApolloServer({ typeDefs, resolvers });

//Применяем промежуточное ПО Apollo GraphQL и указываем путь к /api
server.applyMiddleware({ app, path: '/api' });

app.use('/', indexRouter);

const listener = app.listen(port, function () {
  console.log(
    `GraphQL Server running at http://localhost:${listener.address().port}${
      server.graphqlPath
    }`
  );
});
