const express = require('express');

const router = express.Router();

const Posts = require('../posts/postDb.js');
const Users = require('./userDb.js');

// Create User - COMPLETE
router.post('/', validateUser, async (req, res) => {
  try {
    const user = await Users.insert(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

//CREATE post - COMPLETE
router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const { text } = req.body;
  const user_id = req.params.id;
  const newcomment = { text, user_id };
  try {
    const post = await Posts.insert(newcomment);
    res.status(200).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error creating post' });
  }
});

// GET ALL USERS - COMPLETE
router.get('/', async (req, res) => {
  try {
    const users = await Users.get();
    res.status(200).json(users);
  } catch (err) {
    console.log(error);
    res
      .status(500)
      .json({ error: 'The users information could not be retrieved' });
  }
});

// GET SPECIFIC USER - COMPLETE
router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

// GET USER POSTS - COMPLETE
router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const posts = await Users.getUserPosts(req.user.id);

    res.status(200).json({ posts });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      errorMessage: 'There was an error retrieving posts'
    });
  }
});

// DELETE USER  - COMPLETE
router.delete('/:id', validateUserId, async (req, res) => {
  try {
    const deleted = await Users.remove(req.user.id);
    res.status(200).json(req.user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

// UPDATE USER - COMPLETE
router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
    const updated = await Users.update(req.params.id, req.body);
    if (updated == 1) {
      const fetched = await Users.getById(req.params.id);
      res.status(200).json(fetched);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'There was an error updating user' });
  }
});

//custom middleware

async function validateUserId(req, res, next) {
  try {
    const { id } = req.params;
    const user = await Users.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(404).json({ message: 'User not found ' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to process request' });
  }
}

function validateUser(req, res, next) {
  if (req.body.name) {
    next();
  } else {
    res.status(400).json({ message: 'Name needed to add user' });
  }
}

function validatePost(req, res, next) {
  if (req.body.text) {
    next();
  } else {
    res.status(400).json({ message: 'Text needed to add Post' });
  }
}

module.exports = router;
