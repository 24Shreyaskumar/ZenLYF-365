const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.post('/register', async (req, res) => {
    const { username, email, password, first_name, last_name, date_of_birth, profile_picture_url, bio } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Username, email, and password are required.');
    }

    const password_hash = await bcrypt.hash(password, 10);

    const sql = 'INSERT INTO users (username, email, password_hash, first_name, last_name, date_of_birth, profile_picture_url, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [username, email, password_hash, first_name, last_name, date_of_birth, profile_picture_url, bio], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Internal server error');
        }
        res.send('User registered successfully!');
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
