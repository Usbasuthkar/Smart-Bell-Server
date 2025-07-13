const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
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
      const id = crypto.randomBytes(16).toString("hex");
      const newUser = { email, password: hashedPassword, id };
      await User.insertOne(newUser);
      return res.status(201).json({ message: 'User created successfully',id });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
