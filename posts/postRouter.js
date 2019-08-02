const express = require('express');

const Posts = require('./postDb.js');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const posts = await Posts.get();
    res.status(200).json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'There was an error retrieving posts' });
  }
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, async (req, res) => {
  try {
    const deleted = await Posts.remove(req.params.id);
    if (deleted) {
      res.status(200).json(req.post);
    }
  } catch (err) {
    res.status(500).json({ error: 'There was an error removing post' });
  }
});

router.put('/:id', validatePostId, async (req, res) => {
  const { user_id, id } = req.post;
  const text = req.body;
  try {
    const updated = await Posts.update(id, text, user_id);
    console.log(updated);
    if (updated == 1) {
      const newpost = await Posts.getById(req.params.id);
      res.status(200).json(newpost);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'There was an error updating Post' });
  }
});

// custom middleware

async function validatePostId(req, res, next) {
  const post = await Posts.getById(req.params.id);
  if (post) {
    req.post = post;
    next();
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
}

module.exports = router;
