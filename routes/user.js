const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        res.render('user', { user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Failed to connect');
    }
});

module.exports = router;
