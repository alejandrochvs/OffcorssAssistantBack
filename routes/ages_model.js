var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var agesSchema = new Schema({
    age: {
        type: String,
        unique: true
    }
});
module.exports = mongoose.model('ages', agesSchema);
