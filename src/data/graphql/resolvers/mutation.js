const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  AuthenticationError,
  ForbiddenError
} = require('apollo-server-express');
require('dotenv').config();

const gravatar = require('../../../utils/gravatar');

const newNote = async (parent, args, { models }) => {
  return await models.Note.create({
    content: args.content,
    author: 'Adam Scott'
  });
};

const deleteNote = async (parent, { id }, { models }) => {
  try {
    await models.Note.findOneAndRemove({ _id: id });
    return true;
  } catch (err) {
    return false;
  }
};

const updateNote = async (parent, { content, id }, { models }) => {
  try {
    return await models.Note.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          content
        }
      },
      {
        new: true
      }
    );
  } catch (err) {
    return err;
  }
};

const signUp = async (parent, args, { models }) => {
  const email = args.email.trim().toLowerCase();
  const username = args.username.trim();
  const hashed = await bcrypt.hash(args.password);

  const avatar = gravatar(email);

  try {
    const user = await models.User.create({
      username,
      email,
      avatar,
      password: hashed
    });
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  } catch (err) {
    console.log(err);
    throw new Error('Error creating account');
  }
};

const signIn = async (parent, args, { models }) => {};

const Mutation = {
  newNote,
  deleteNote,
  updateNote,
  signUp,
  signIn
};

module.exports = Mutation;
