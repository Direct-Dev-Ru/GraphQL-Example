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

const Mutation = {
  newNote,
  deleteNote,
  updateNote
};

module.exports = Mutation;
