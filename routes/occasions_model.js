var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var occasionsSchema = new Schema({
    occasion: {
        type: String,
        unique: true
    }
});
module.exports = mongoose.model('occasions', occasionsSchema);
