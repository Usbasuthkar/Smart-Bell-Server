const express = require('express');
const router = express.Router();

module.exports = (collections) => {
    const { UserType } = collections;
    router.get('/usertype', async (req, res) => {
        const { id } = req.query;

        if (!id) {
            return res.status(400).json({ error: 'id is required' });
        }

        try {
            const user = await UserType.findOne({ id });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.json({ type: user.type,email:user.email });
        } catch (error) {
            console.error('Error fetching user type:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });

    return router;
};
