// Dependencies
// Express.js connection
const router = require('express').Router();

// User, Post, Comment models
const { User, Post, Comment } = require('../../models');

// Express Session for the session data
const session = require('express-session');

// Authorization Helper
const withAuth = require('../../utils/auth');

// Sequelize store to save the session so the user can remain logged in
const SequelizeStore = require('connect-session-sequelize')(session.Store);

//ROUTES

// GET all users
router.get('/', (req, res) => {
  // Access the User model and run .findAll() method to get all users
  User.findAll({
    // Exclude the password when the data is sent back
    attributes: { exclude: ['password'] },
  })
    // Return data - JSON formatted
    .then((dbUserData) => res.json(dbUserData))
    // If server error, return error
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

// Get a single user by id
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    // Use id as the parameter for the request
    where: {
      id: req.params.id,
    },
    // Include the posts the user has created, the posts the user has commented on
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'content', 'created_at'],
      },

      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: Post,
          attributes: ['title'],
        },
      },
    ],
  })
    .then((userData) => {
      if (!userData) {
        // If no user is found, return error
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      // Else, return the data for requested user
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Add a new user
router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password,
  })

    .then((userData) => {
      req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.username = userData.username;
        req.session.loggedIn = true;

        res.json(userData);
      });
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Login route for a user
router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({
      where: { username: req.body.username },
    });

    if (!userData) {
      res.status(400).json({ message: 'No user with that username!' });
      return;
    }
   
    const validPassword = userData.checkPassword(req.body.password);

    
    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }
    req.session.save(() => {
     
      req.session.user_id = userData.id;
      req.session.username = userData.username;
      req.session.loggedIn = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Log out an existing user
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      // 204 - request has succeeded
      res.status(204).end();
    });
  } else {
    // if there is no session
    res.status(404).end();
  }
});


router.put('/:id', withAuth, (req, res) => {
  User.update(req.body, {
   
    individualHooks: true,
   
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Delete an existing user
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((userData) => {
      if (!userData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(userData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
