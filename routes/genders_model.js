var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var gendersSchema = new Schema({
    gender: {
        type: String,
        unique: true
    }
});
module.exports = mongoose.model('genders', gendersSchema);
