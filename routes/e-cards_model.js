var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var eCardsSchema = new Schema({
    url: {
        type: String,
        unique: true
    },
    gender: {
        type: String,
    },
    age: {
        type: String,
    },
    reference: {
        type: Array,
    },
    type: {
        type: Array,
    },
    color: {
        type: Array,
    },
    weather: {
        type: Array,
    },
    occasion: {
        type: Array,
    }
    
});
module.exports = mongoose.model('e_cards', eCardsSchema);
