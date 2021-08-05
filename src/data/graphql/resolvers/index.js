const Query = require('./query');
const Mutation = require('./mutation');
const {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} = require('graphql-iso-date');

module.exports = {
  Query,
  Mutation,
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime
};
