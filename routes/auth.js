const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET login page
router.get('/login', (req, res) => {
    res.render('login');
});

// GET register page
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password, first_name, last_name, date_of_birth, profile_picture_url, bio } = req.body;

    try {
        let user = await User.findOne({ email   });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            first_name,
            last_name,
            date_of_birth,
            profile_picture_url,
            bio,
            date_created: Date.now(),
            last_login: null
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        res.redirect('/auth/login');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Auth - Failed to connect');
    }
});

// Login Route

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        user.last_login = Date.now();
        await user.save();

        if (user.isAdmin) {
            res.redirect('/admin');
        } else {
            res.redirect(`/user/${user._id}`);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Auth - Failed to connect');
    }
});

module.exports = router;
