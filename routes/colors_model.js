var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var colorsSchema = new Schema({
    color: {
        type: String,
        unique: true
    },
    hex : {
        type : String,
        unique : true
    }
});
module.exports = mongoose.model('colors', colorsSchema);
