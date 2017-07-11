var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var weathersSchema = new Schema({
    weather: {
        type: String,
        unique: true
    }
});
module.exports = mongoose.model('weathers', weathersSchema);
