const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

module.exports = (collections) => {
  const { User } = collections;

  router.post('/signup', async (req, res) => {
    const { email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = { email, password: hashedPassword };

      await User.insertOne(newUser);
      res.status(201).json({ message: 'User created successfully' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
