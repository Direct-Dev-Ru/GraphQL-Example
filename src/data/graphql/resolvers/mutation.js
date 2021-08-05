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

const Mutation = {
  newNote,
  deleteNote
};

module.exports = Mutation;
