var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var typesSchema = new Schema({
    type: {
        type: String,
        unique: true
    }
});
module.exports = mongoose.model('types', typesSchema);
