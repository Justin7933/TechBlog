// Gather the models and export them for use

// User model
const User = require('./User');
// Post model
const Post = require('./Post');
// Comment model
const Comment = require('./Comment');

//Post-User relationship
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

// Post-Comment relationship
Post.hasMany(Comment, {
  foreignKey: 'postId',
  onDelete: 'CASCADE',
  hooks: true,
});

// Comment-User relationship
Comment.belongsTo(User, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  hooks: true,
});

// Comment-Post relationship
Comment.belongsTo(Post, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true,
});

// User-Post relationship
User.hasMany(Post, {
  foreignKey: 'user_id',
});

// User-Comment relationship
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'cascade',
  hooks: true,
});

module.exports = { User, Post, Comment };
