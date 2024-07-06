const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    profile_picture_url: { type: String },
    bio: { type: String },
    date_created: { type: Date, default: Date.now },
    last_login: { type: Date },
    isAdmin: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);
