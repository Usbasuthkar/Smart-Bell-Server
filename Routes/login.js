const express = require('express');
const bcrypt = require('bcrypt');

const router = express.Router();

module.exports = (collections) => {
  const { User } = collections;

  router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      res.status(200).json({ message: 'Login successful' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  return router;
};
