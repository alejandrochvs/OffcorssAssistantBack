var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    mail: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },
    last_connection: {
        type: Date,
        required: true
    },
    last_ip: {
        type: String,
        required: true
    },
    current_page: {
        type: Number,
        required: true
    },
    profile_picture : {
        type : String,
        required : true
    },
    access_level : {
        type : String,
        required: true
    }
});
var users = mongoose.model('users', userSchema);
module.exports = users;
