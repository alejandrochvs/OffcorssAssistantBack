var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sizesSchema = new Schema({
    name: {
        type: String,
        unique: true
    },
    top: {
        type: Object,
    },
    bottom: {
        type: Object,
    },
    shoes: {
        type: Object,
    }
});
module.exports = mongoose.model('sizes', sizesSchema);
