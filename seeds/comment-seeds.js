const { Comment } = require('../models');

const commentData = [
  {
    comment_text: 'Pipe will seek funding from top investors',
    user_id: 1,
    post_id: 1,
  },
  {
    comment_text:
      'Minnows has shown potential to caputre market share in large cities',
    user_id: 2,
    post_id: 2,
  },
  {
    comment_text: 'SnackPass is making rounds in universities',
    user_id: 3,
    post_id: 3,
  },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;
